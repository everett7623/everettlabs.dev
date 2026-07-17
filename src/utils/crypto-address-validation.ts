import { createHash } from 'node:crypto';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BECH32_ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const BECH32_CHECKSUM = 1;
const BECH32M_CHECKSUM = 0x2bc830a3;

function hasMatchingChecksum(decoded: Uint8Array): boolean {
  if (decoded.length < 5) return false;

  const payload = decoded.subarray(0, -4);
  const checksum = decoded.subarray(-4);
  const firstHash = createHash('sha256').update(payload).digest();
  const expected = createHash('sha256').update(firstHash).digest().subarray(0, 4);

  return checksum.every((byte, index) => byte === expected[index]);
}

function decodeBase58(value: string): Uint8Array | null {
  let decoded = 0n;

  for (const character of value) {
    const digit = BASE58_ALPHABET.indexOf(character);
    if (digit < 0) return null;
    decoded = decoded * 58n + BigInt(digit);
  }

  const hex = decoded === 0n ? '' : decoded.toString(16).padStart(2, '0');
  const body = hex ? Uint8Array.from(Buffer.from(hex.length % 2 ? `0${hex}` : hex, 'hex')) : [];
  const leadingZeroes = value.length - value.replace(/^1+/, '').length;
  const result = new Uint8Array(leadingZeroes + body.length);
  result.set(body, leadingZeroes);
  return result;
}

function isBase58CheckAddress(
  address: string,
  payloadLength: number,
  versions: readonly number[],
): boolean {
  const decoded = decodeBase58(address);
  return (
    decoded !== null &&
    decoded.length === payloadLength + 4 &&
    versions.includes(decoded[0]) &&
    hasMatchingChecksum(decoded)
  );
}

function bech32Polymod(values: readonly number[]): number {
  const generators = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let checksum = 1;

  for (const value of values) {
    const high = checksum >>> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    generators.forEach((generator, index) => {
      if ((high >>> index) & 1) checksum ^= generator;
    });
  }

  return checksum >>> 0;
}

function convertBits(values: readonly number[], from: number, to: number): number[] | null {
  let accumulator = 0;
  let bits = 0;
  const result: number[] = [];
  const mask = (1 << to) - 1;

  for (const value of values) {
    if (value < 0 || value >>> from !== 0) return null;
    accumulator = (accumulator << from) | value;
    bits += from;

    while (bits >= to) {
      bits -= to;
      result.push((accumulator >>> bits) & mask);
    }
  }

  if (bits >= from || ((accumulator << (to - bits)) & mask) !== 0) return null;
  return result;
}

function isBitcoinSegwitAddress(address: string): boolean {
  if (
    address.length > 90 ||
    (address !== address.toLowerCase() && address !== address.toUpperCase())
  ) {
    return false;
  }

  const normalized = address.toLowerCase();
  const separator = normalized.lastIndexOf('1');
  if (separator !== 2 || normalized.slice(0, separator) !== 'bc') return false;

  const values = [...normalized.slice(separator + 1)].map((character) =>
    BECH32_ALPHABET.indexOf(character),
  );
  if (values.length < 7 || values.some((value) => value < 0)) return false;

  const hrpValues = [3, 3, 0, 2, 3]; // Bech32 expansion of "bc".
  const polymod = bech32Polymod([...hrpValues, ...values]);
  const data = values.slice(0, -6);
  const witnessVersion = data[0];
  if (witnessVersion === undefined || witnessVersion > 16) return false;
  if (polymod !== (witnessVersion === 0 ? BECH32_CHECKSUM : BECH32M_CHECKSUM)) return false;

  const witnessProgram = convertBits(data.slice(1), 5, 8);
  if (!witnessProgram || witnessProgram.length < 2 || witnessProgram.length > 40) return false;
  return witnessVersion !== 0 || witnessProgram.length === 20 || witnessProgram.length === 32;
}

function crc16Xmodem(value: Uint8Array): number {
  let crc = 0;

  for (const byte of value) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc;
}

export function isTronMainnetAddress(address: string): boolean {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address) && isBase58CheckAddress(address, 21, [0x41]);
}

export function isEvmAddress(address: string): boolean {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;

  const body = address.slice(2);
  return body === body.toLowerCase() || body === body.toUpperCase();
}

export function isBitcoinMainnetAddress(address: string): boolean {
  if (/^[13][1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
    return isBase58CheckAddress(address, 21, [0x00, 0x05]);
  }

  return /^bc1/i.test(address) && isBitcoinSegwitAddress(address);
}

export function isTonMainnetFriendlyAddress(address: string): boolean {
  if (!/^[A-Za-z0-9_-]{48}$/.test(address)) return false;

  const decoded = Uint8Array.from(
    Buffer.from(address.replaceAll('-', '+').replaceAll('_', '/'), 'base64'),
  );
  if (decoded.length !== 36) return false;

  const tag = decoded[0];
  const workchain = decoded[1];
  if (
    (tag & 0x80) !== 0 ||
    ![0x11, 0x51].includes(tag & 0x7f) ||
    ![0x00, 0xff].includes(workchain)
  ) {
    return false;
  }

  const expected = crc16Xmodem(decoded.subarray(0, 34));
  return decoded[34] === expected >>> 8 && decoded[35] === (expected & 0xff);
}

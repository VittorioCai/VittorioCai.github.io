const syntheticParts = ['0176', '0000', '0000'] as const;
const [domesticPrefix, firstBlock, secondBlock] = syntheticParts;
const nationalPrefix = domesticPrefix.slice(1);

export const syntheticNumericIdentifier = [
  nationalPrefix,
  firstBlock,
  secondBlock,
].join('');

export const syntheticGermanMobileFixtures = [
  syntheticParts.join(''),
  syntheticParts.join(' '),
  [nationalPrefix, firstBlock, secondBlock].join(' '),
  ['+49', nationalPrefix, firstBlock, secondBlock].join('-'),
  ['+49', '(0)', nationalPrefix, firstBlock, secondBlock].join(' '),
  ['0049', `(0)${nationalPrefix}`, firstBlock, secondBlock].join('.'),
  syntheticParts.join('/'),
  syntheticParts.join('–'),
  [
    `(${domesticPrefix})`,
    firstBlock.slice(0, 2),
    firstBlock.slice(2),
    secondBlock.slice(0, 2),
    secondBlock.slice(2),
  ].join(' '),
  [
    '+49',
    '(0)',
    nationalPrefix,
    '/',
    firstBlock.slice(0, 2),
    firstBlock.slice(2),
    '/',
    secondBlock.slice(0, 2),
    secondBlock.slice(2),
  ].join(' '),
] as const;

export function containsGermanMobileNumber(value: string): boolean {
  const phoneLikeSegments = value.match(
    /(?<!\d)(?:\+49|0049|\(?0|1[5-7])[\d\s./()+\-–—\u00a0]{7,48}\d/g,
  );

  return (phoneLikeSegments ?? []).some((segment) => {
    const hasExplicitPrefix = /^(?:\+49|0049|\(?0)/.test(segment);
    const hasSeparator = /[\s./()+\-–—\u00a0]/.test(segment);

    if (!hasExplicitPrefix && !hasSeparator) return false;

    const digits = segment.replace(/\D/g, '');
    let nationalNumber = digits;

    if (nationalNumber.startsWith('0049')) {
      nationalNumber = nationalNumber.slice(4);
    } else if (nationalNumber.startsWith('49')) {
      nationalNumber = nationalNumber.slice(2);
    }

    if (nationalNumber.startsWith('0')) {
      nationalNumber = nationalNumber.slice(1);
    }

    return /^1[5-7]\d{8,9}$/.test(nationalNumber);
  });
}

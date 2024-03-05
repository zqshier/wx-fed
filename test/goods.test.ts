import { goodsSkuIsDisabled, skuCombs } from '../src/utils/goods';

describe('商品SKU库存', () => {
  const skuConfigs = [
    { k: '品种', values: ['黄糯', '水果'] },
    { k: '重量/袋数', values: ['6穗', '10穗'] },
  ];
  const skus = [
    {
      id: 607,
      price: '0.01',
      guidePrice: null,
      image: '',
      comb: [
        { k: '品种', v: '黄糯', kId: 46, vId: 127 },
        { k: '重量/袋数', v: '6穗', kId: 55, vId: 152 },
      ],
      combKey: '黄糯+6穗',
      isSoldOut: false,
    },
    {
      id: 608,
      price: '0.02',
      guidePrice: null,
      image: '',
      comb: [
        { k: '品种', v: '黄糯', kId: 46, vId: 127 },
        { k: '重量/袋数', v: '10穗', kId: 55, vId: 153 },
      ],
      combKey: '黄糯+10穗',
      isSoldOut: true,
    },
    {
      id: 609,
      price: '0.01',
      guidePrice: null,
      image: '',
      comb: [
        { k: '品种', v: '水果', kId: 46, vId: 151 },
        { k: '重量/袋数', v: '6穗', kId: 55, vId: 152 },
      ],
      combKey: '水果+6穗',
      isSoldOut: true,
    },
    {
      id: 610,
      price: '0.02',
      guidePrice: null,
      image: '',
      comb: [
        { k: '品种', v: '水果', kId: 46, vId: 151 },
        { k: '重量/袋数', v: '10穗', kId: 55, vId: 153 },
      ],
      combKey: '水果+10穗',
      isSoldOut: false,
    },
  ];

  it('SKU组合和库存状态', () => {
    const res = skuCombs(skuConfigs, skus);
    expect(res).toEqual([
      { key: ['黄糯', '6穗'], isSoldOut: false },
      { key: ['黄糯', '10穗'], isSoldOut: true },
      { key: ['水果', '6穗'], isSoldOut: true },
      { key: ['水果', '10穗'], isSoldOut: false },
    ]);
  });

  it('单规格组合', () => {
    const res = skuCombs(
      [],
      [
        {
          id: 552,
          price: '5.00',
          guidePrice: null,
          image: '',
          comb: [{ k: '', v: '', kId: 0, vId: 0 }],
          combKey: '',
          isSoldOut: false,
        },
      ],
    );
    expect(res).toEqual([{ key: [''], isSoldOut: false }]);
  });

  it('单规格 - 有库存', () => {
    const skusComb = [{ key: [''], isSoldOut: false }];
    expect(goodsSkuIsDisabled(skusComb, [])).toBe(false);
  });

  it('单规格 - 无库存', () => {
    const skusComb = [{ key: [''], isSoldOut: true }];
    expect(goodsSkuIsDisabled(skusComb, [])).toBe(true);
  });

  it('SKU都有库存可选', async () => {
    const skusComb = [
      { key: ['黄糯', '6穗'], isSoldOut: false },
      { key: ['黄糯', '10穗'], isSoldOut: false },
    ];
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', ''])).toBe(false);
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', '6穗'])).toBe(false);
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', '10穗'])).toBe(false);
  });

  it('SKU都无库存不可选', async () => {
    const skusComb = [
      { key: ['黄糯', '6穗'], isSoldOut: true },
      { key: ['黄糯', '10穗'], isSoldOut: true },
    ];
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', ''])).toBe(true);
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', '6穗'])).toBe(true);
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', '10穗'])).toBe(true);
  });

  it('SKU部分库存不可选', async () => {
    const skusComb = [
      { key: ['黄糯', '6穗'], isSoldOut: false },
      { key: ['黄糯', '10穗'], isSoldOut: true },
    ];
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', ''])).toBe(false);
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', '6穗'])).toBe(false);
    expect(goodsSkuIsDisabled(skusComb, ['黄糯', '10穗'])).toBe(true);
  });
});

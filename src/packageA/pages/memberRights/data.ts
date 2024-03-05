export const memberRightsData = [
  {
    image: 'static/level_1.png',
    imageSelct: 'static/level_1_s.png',
    level: '1',
    levelName: '赤铜会员',
    list: [
      { image: require('@/static/icon/gift.png'), name: '新人礼' },
      { image: require('@/static/icon/mission.png'), name: '积分换礼' },
      { image: require('@/static/icon/free-ship.png'), name: '礼品包邮' },
      { image: require('@/static/icon/birth.png'), name: '生日礼券' },
    ],
  },
  {
    image: 'static/level_2.png',
    imageSelct: 'static/level_2_s.png',
    level: '2',
    levelName: '焰银会员',
    list: [
      { image: require('@/static/icon/gift.png'), name: '新人礼' },
      { image: require('@/static/icon/mission.png'), name: '积分换礼' },
      { image: require('@/static/icon/free-ship.png'), name: '礼品包邮' },
      { image: require('@/static/icon/birth.png'), name: '生日礼券' },
      { image: require('@/static/icon/lvup.png'), name: '升级券包' },
      { image: require('@/static/icon/point.png'), name: '1.2倍积分' },
    ],
  },
  {
    image: 'static/level_3.png',
    imageSelct: 'static/level_3_s.png',
    level: '3',
    levelName: '烈金会员',
    list: [
      { image: require('@/static/icon/gift.png'), name: '新人礼' },
      { image: require('@/static/icon/mission.png'), name: '积分换礼' },
      { image: require('@/static/icon/free-ship.png'), name: '礼品包邮' },
      { image: require('@/static/icon/birth.png'), name: '生日礼券' },
      { image: require('@/static/icon/lvup.png'), name: '升级券包' },
      { image: require('@/static/icon/point.png'), name: '1.5倍积分' },
    ],
  },
  {
    image: 'static/level_4.png',
    imageSelct: 'static/level_4_s.png',
    level: '4',
    levelName: '火钻会员',
    list: [
      { image: require('@/static/icon/gift.png'), name: '新人礼' },
      { image: require('@/static/icon/mission.png'), name: '积分换礼' },
      { image: require('@/static/icon/free-ship.png'), name: '礼品包邮' },
      { image: require('@/static/icon/birth.png'), name: '生日礼券' },
      { image: require('@/static/icon/lvup.png'), name: '升级券包' },
      { image: require('@/static/icon/point.png'), name: '2倍积分' },
    ],
  },
];

export const descInfo = [
  {
    title: '会员等级说明',
    content: [
      `自Zippo会员中心小程序会员2.0版本更新之日起，会员等级于每日0点之后更新。会员等级由用户过去365个自然日内已完成的订单实付总金额（剔除退款金额）决定，与会员的小火苗（积分）数量无关，具体如下：
      赤铜会员：Zippo会员中心提交手机号成功；订单实付总金额399元以内（含）
      焰银会员：订单实付总金额400~1999元
      烈金会员：订单实付总金额2000~4999元
      火钻会员：订单实付总金额5000元或以上`,
      `会员升级规则：
      在过去365个自然日内，用户于Zippo中国大陆地区的官方小程序会员商城、自营官方旗舰店、官方授权渠道购买产品，已完成的订单实付总金额（包含小程序剔除退款金额后的订单转换记录）达到对应标准，即可在次日0点之后升级为对应等级会员。官方小程序会员商城订单的实付总金额，将在该订单完成后7个自然日的次日0点自动完成累计。`,
      `会员降级规则：
      若在过去365个自然日内，用户的订单实付总金额少于该等级要求，则降级到对应等级。
      若在过去365个自然日内，用户未产生任何订单实付总金额记录，则降级为赤铜会员。`,
    ],
  },
  {
    title: '小火苗（积分）攻略',
    content: [
      {
        type: 'ul',
        values: [
          {
            type: 'text',
            value: '一、小火苗获取',
          },
          {
            type: 'li',
            value: 'Zippo会员中心的会员积分，在会员中心内统一称为“小火苗”。',
          },
          {
            type: 'li',
            value:
              '自Zippo会员中心小程序会员2.0版本更新之日起，会员本人（系统唯一识别unionID）于Zippo中国大陆地区的官方小程序会员商城、自营官方旗舰店、官方授权渠道购买的正装产品订单（在过去365个自然日内已完成的订单，包含小程序剔除退款金额后的订单转换记录；燃油、耗材订单不参与小火苗累积），可获得实付金额相应数值的小火苗：每笔订单中，实付每1元累计1小火苗，不足1元的部分按照1元累计。',
          },
          {
            type: 'li',
            value: '按照会员等级，会员可享有购物小火苗倍率膨胀权益。',
          },
          {
            type: 'li',
            value:
              '会员在Zippo官方小程序会员商城内购物，可享受2倍小火苗福利（如有特殊活动，以活动页面内容为准）；同时享有会员等级膨胀倍率。',
          },
          {
            type: 'li',
            value:
              'Zippo官方小程序会员商城的订单小火苗，将于该订单完成后7个自然日自动发放到会员账户；发放的小火苗数量（包含会员等级膨胀倍率），以会员下单时的等级计算为准。',
          },
          {
            type: 'li',
            value:
              '如您的订单在获得小火苗后产生退款，Zippo有权扣除该订单所获得的小火苗。如您账户中的小火苗已被使用，则需联系客服办理相应退还手续，再申请退款。',
          },
          {
            type: 'li',
            value: '会员完成小程序中的新人注册、完善个人信息、每日签到等互动任务，可获得相应数量的小火苗奖励。',
          },
          {
            type: 'li',
            value: '会员参与不定期举行的社群福利活动，有机会获得小火苗奖励。',
          },
        ],
      },
      {
        type: 'ul',
        values: [
          {
            type: 'text',
            value: '二、小火苗兑换',
          },
          {
            type: 'li',
            value:
              '会员目前仅可在Zippo会员中心微信小程序的“积分有礼”模块使用小火苗进行礼品兑换，兑换成功后系统将自动扣除相应小火苗。',
          },
          {
            type: 'li',
            value:
              '积分有礼模块内的礼品将不定期进行调整，并以商城实际供应为准。目前仅为积分兑礼形式，限定数量，先到先得。',
          },
          {
            type: 'li',
            value: '积分有礼模块内使用小火苗兑换商品不支持开具发票。',
          },
          {
            type: 'li',
            value: '礼品展示图片仅供参考，请以兑换的产品名称或描述为准。',
          },
          {
            type: 'li',
            value: `积分有礼模块的兑换规则如下（以商品展示详情页的实际规则为准）：
            （1）积分有礼模块下单后，一般14个自然日内发货，节假日顺延；
            （2）除质量问题外，积分兑换的礼品不予退换；
            （3）商品本身若出现所签收礼品与所兑换礼品不一致或质量问题，请在收到商品后七个自然日内联系客服，在双方达成一致后进入商品的退换流程；
            （4）如会员因自身原因且未经协商退货的，该积分不予退还。
            `,
          },
        ],
      },
      {
        type: 'ul',
        values: [
          {
            type: 'text',
            value: '三、小火苗规则',
          },
          {
            type: 'li',
            value:
              '小火苗的有效期为一年，即365个自然日（自获取小火苗当天开始计算）。例如：会员在2023年12月10日获得150小火苗，有效期截止到2024年12月9日，2024年12月10日该150小火苗过期，以此类推。',
          },
          {
            type: 'li',
            value:
              '会员在Zippo会员中心小程序会员2.0版本更新之前获得、且未过期的全部小火苗，在系统更新并迁移数据后，将以“迁移”性质统一获得365个自然日的有效期。',
          },
          {
            type: 'li',
            value:
              '为保护广大真实会员的权益，Zippo有权屏蔽非常规的小火苗获取及兑换行为。对于任何通过不正当手段（包括但不限于作弊、通过机器行为等方式恶意刷单）获取小火苗权益或恶意兑换、退单的行为，我们一经核实将在不事先通知的前提下取消该用户已获得的相应小火苗并取消使用该小火苗兑换商品的订单，同时屏蔽该用户。Zippo公司保留对该用户追究法律责任的权利。',
          },
          {
            type: 'li',
            value: '因特殊情况，如支付失败或取消订单而导致订单未完成的，则已累积的小火苗予以相应撤销。',
          },
          {
            type: 'li',
            value: '小火苗仅限会员本人（系统唯一识别unionID）使用，无法通过他人转让、赠与、借用等方式获取。',
          },
          {
            type: 'li',
            value: '小火苗为Zippo对会员的福利回馈，仅可按照本协议约定的方式使用。',
          },
          {
            type: 'li',
            value:
              '如您申请注销用户账号的，账户内会员小火苗将相应清空且再次注册时亦无法恢复，详见《ZIPPO会员中心服务协议》，请您谨慎操作。',
          },
          {
            type: 'li',
            value:
              'Zippo维护所有会员的权益，确保所有礼品均由具备合法资质的供应商提供质量合格的原厂正品。礼品信息均来自于合作方，其真实性、准确性和合法性由礼品供应商负责，Zippo会员中心不提供任何担保，并不承担任何法律责任；Zippo会员中心礼品售后服务均由品牌厂家提供，若您收到的礼品发现有质量问题，请及时与我们联系，我们将协助您一起维护您的合法权益。',
          },
          {
            type: 'text',
            value: `注：本规则中的“消费”是指实际支付金额，而不是原价金额优惠前订单金额等。
            注：符合本规则规定的小火苗，一般情况下在24小时内自动进入您的积分账户，特殊情况下会有延迟。您可以联系客服协助处理。`,
          },
        ],
      },
      {
        type: 'ul',
        values: [
          {
            type: 'text',
            value: `四、免责声明
            因下述原因之一导致会员不能正常使用会员服务的，Zippo应当协助会员解决问题并提供必要的帮助，但Zippo不承担任何赔偿责任：`,
          },
          {
            type: 'li',
            value: '系统的停机维护、故障。',
          },
          {
            type: 'li',
            value:
              '电力、电信或银行的系统、设备或网站发生故障、不稳定或升级维护，导致停电、或数据传输不稳定、失败或中断。',
          },
          {
            type: 'li',
            value: 'Zippo会员中心的平台、程序、系统受黑客攻击、计算机病毒等影响导致会员服务无法正常使用。',
          },
          {
            type: 'li',
            value:
              '因台风、地震、海啸、洪水、疫情、战争、恐怖袭击、暴动、游行示威、公共设施损坏、政府行为、法律变更等不可抗力原因，造成门店线下不能正常营业或造成系统不能正常运行的。',
          },
          {
            type: 'li',
            value:
              '因会员自身对账户、密码信息的保存不当导致会员账号被盗或其他会员自身原因造成的泄露、丢失、被他人篡改等。',
          },
        ],
      },
      `五、其他说明
      本规则的修订：我们将根据经营情况的变化不定期修改本规则，请您及时予以关注。若您在本业务规则内容公告变更后继续使用我们的会员小火苗服务的，表示您已充分阅读、理解并接受修改后的业务规则内容，也将遵循修改后的业务规则使用我们的会员小火苗服务。如您对本规则条款有任何疑问或需要任何帮助，可通过联系客服或发送邮件到SERVICECHINA@ZIPPO.COM向我们反馈。`,
    ],
  },
];

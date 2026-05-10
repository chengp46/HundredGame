# 协议

## 登录

* 请求登录

 ```json
{
  "msg_id": "login_req",
  "address": "0x12345",
  "once": 1,
  "signature": "0x1234"
} 
```

* 登录成功返回

 ```json
{
  "msg_id": "login_resp",
  "address": "address",
  "access_token": "access_token",
  "assets": [
    {
      "symbol": "PEPE",
      "amount": 1000
    },
    {
      "symbol": "ETH",
      "amount": 1000
    },
    {
      "symbol": "USDT",
      "amount": 1000
    }
  ]
}
```

* 登录失败返回

 ```json
{
  "msg_id": "login_resp",
  "code": 1
}
```



## 资产结算请求

```json
{
  "msg_id": "settle_assets_req",
  "symbol": "PEPE"
} 
```
* 返回 assets_push

## 下注

* 请求

```json
{
  "msg_id": "bet_req",
  "symbol": "PEPE",
  "zone": "zone_id",
  "amount": 10
} 
```

* 下注成功返回

```json
{
  "msg_id": "bet_push",
  "is_self":true,
  "symbol": "PEPE",
  "zone": "zone_id",
  "amount": 10,
  "role_amount": 100,
  "room_amount": 100
} 
```

* 下注失败返回

```json
{
  "msg_id": "bet_resp",
  "code": 100
} 
```

### 路单请求
```json
{
  "msg_id": "roads_req"
} 
```



## 玩家重连请求协议和流程

* 通过 /api/login/reconnect_token post 传入参数 access_token address
  ```json
  {
  "access_token": "access_token",
  "address": "address"
  }
    ``` 
  获取重连reconnect_token
* 通过协议
```json
{
  "msg_id": "reconnect_req",
  "address": "address",
  "reconnect_token": "reconnect_token"
} 
``` 
* 重连返回login_resp

## 游戏房间协议

### 准备阶段
```json
{
  "msg_id": "phase_push",
  "phase": "prepare",
  "round_id": "round_id",
  "end_time": "时间戳"
}
```
### 发牌下注阶段
```json
{
  "msg_id": "phase_push",
  "phase": "dealing",
  "round_id": "round_id",
  "result_hash": "结果hash",
  "end_time": "时间戳"
}
```
### 开牌结算阶段
```json
{
  "msg_id": "phase_push",
  "phase": "settlement",
  "round_id": "round_id",
  "result_hash": "结果hash",
  "random_str": "随机字符串",
  "player": "闲家牌",
  "banker": "庄家牌",
  "end_time": "时间戳"
}
```
## 玩家推送协议
### 无效下注推送 此协议会在结算时推送
```json
{
  "msg_id": "invalid_bets",
  "round_id": "round_id"
}
```
### 路单推送
```json
{
  "msg_id": "roads_push",
  "roads": [
      {
        "round_id": "20260507-01",
        "winner": "banker",
        "banker_points": 7,
        "player_points": 5,
        "tie_flag": false,
        "natural": false
      }
    ]
}
```

## 资产更新

 ```json
{
  "msg_id": "assets_push",
  "wallet": [
    {
      "symbol": "PEPE",
      "amount": 1000
    },
    {
      "symbol": "ETH",
      "amount": 1000
    },
    {
      "symbol": "USDT",
      "amount": 1000
    }
  ],
  "pending": [
    {
      "symbol": "PEPE",
      "amount": 1000
    },
    {
      "symbol": "ETH",
      "amount": 1000
    },
    {
      "symbol": "USDT",
      "amount": 1000
    }
  ],
  "balance": [
    {
      "symbol": "PEPE",
      "amount": 1000
    },
    {
      "symbol": "ETH",
      "amount": 1000
    },
    {
      "symbol": "USDT",
      "amount": 1000
    }
  ]
} 
```
## 找零钱

function MinCoinChange(coins) {

    var coins = coins
    coins.sort((a, b) => a - b)
    this.makeChange = function(amount) {
        var change = [],
            total = 0
            //贪心算法，比较好理解的逻辑。首先从最大的开始拿数据，累加给total
        for (var i = coins.length; i >= 0; i--) {
            var coin = coins[i]
            while (total + coin <= amount) {
                change.push(coin)
                total += coin
            }
        }
        console.log(total)
        return change
    }

}

var minCoinChange = new MinCoinChange([186, 419, 83, 408])
console.log(minCoinChange.makeChange(6249))

## 移掉 K 位数字，组合最小

- 给定一个以字符串表示的非负整数  num，移除这个数中的 k 位数使得剩下的数字最小。

注意:

num 的长度小于 10002 且  ≥ k。
num 不会包含任何前导零。
示例 1 :

输入: num = "01432219", k = 3
输出: "1219"
解释: 移除掉三个数字 4, 3, 和 2 形成一个新的最小的数字 1219。

- @param {number} k
- @return {string}
  var removeKdigits = function(num, k) {

      var stack = []
      stack.push(num[0])
      for (let i = 1; i < num.length; i++) {
          var val = num[i]
          var stackTop = stack[stack.length - 1]
              // 重要的还是这里使用栈的思想（确实没想到，一开始）
          while (val < stackTop && k > 0 && stack.length >= 0) {
              stack.pop()
              stackTop = stack[stack.length - 1]
              k--
          }
          if (val !== '0') {
              stack.push(val)
          }
      }
      while (k) {
          stack.pop()
          k--
      }
      return stack.length == 0 ? '0' : stack.join('')

  }

var str = removeKdigits('1432219', 3)
console.log(str);

## 跳跃游戏

/\*\*

- @param {number[]} nums
- @return {number}
- leetcode 45
  \*/
  var jump = function(nums) {

      if (nums.length < 2) return 0
      var current_max = nums[0] // 当前可达到最远的位置
      var pre_max = nums[0] // 遍历各个位置过程中，可达到最远的位置
      var jumpCount = 1
      for (let i = 1; i < nums.length; i++) {
          // 当前位置i 大于当前最大的跳跃位置了，则可进行跳跃。pre
          if (i > current_max) {
              // 每次挑最大的跳，这样子，跳的次数++
              jumpCount++
              current_max = pre_max
          }

          if (pre_max < nums[i] + i) {
              // pre_max 遍历过程中，可跳跃的最大位置
              pre_max = nums[i] + i
          }
      }
      return jumpCount

};

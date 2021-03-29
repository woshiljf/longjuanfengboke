## 回溯算法：满足条件就进行下一步，不满足则推出（多使用递归的方法来执行）

- function findFullPath(root,value) {
  function \_find(node,value,result) {

          result.push(node.value)
          if(node.value == value){
              return result
          }

          if(node.left) {
              let find = _find(node.left , value, result)
              if(find) return find
          }
          if(node.right) {
              let find = _find(node.right , value, result)
              if(find) return find
          }
          // 找不到当前的节点，就弹出
          result.pop()
      }
      return _find(root,value,[]) || []

}

## 排列组合

/\*\*

- 输入[1,2,3]
-
- 排列为 6 种：[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]
  组合为 8 种：[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]
  \*/

// 排列
var data = [1, 2, 3]
// printPailie(data)
// printZuhe(data)

function printPailie(data) {
// 要循环递归的函数
function \_print(data, result) {

        // 数组长度相同，表示已经组成了一组数据了
        if (result.length == data.length) {
            console.log(result)
                // 当result的长度等于data的长度，直接返回。当前执行的函数弹出执行栈
            return
        }
        for (let i = 0; i < data.length; i++) {
            // 如果当前的result，不包含，则入栈
            if (result.indexOf(data[i]) < 0) {
                // 入栈
                result.push(data[i])
                    // 递归
                _print(data, result)
                    // 这一步出栈非常到位（递归的函数执行回溯）
                result.pop()
            }

        }

    }
    _print(data, [])

}

## 组合

function printZuhe(data) {

    function _print(data, index, result) {

        console.log(result)
            // 没有想到index 这个，实在是差一点想法
        for (let i = index; i < data.length; i++) {

            result.push(data[i])
            _print(data, i + 1, result)
            result.pop()
        }


    }
    _print(data, 0, [])

}

printZuhe([1, 2, 3])

## 括号组合

- n = 3 :表示给出 3 对（）,3 对括号组合的方式，不重复存到数组里

var n = 3

var generateParenthesis = function (n) {
let res = []
// cur :当前字符 left：当前字符左括号 right:当前字符右括号
// 想到这种方法的，先理清递归执行的条件，可以用栈的方式去理解递归的执行方式。

- 格式

const help = (cur, left, right) => {

     if (cur.length === 2 * n) {
       res.push(cur)
       return
     }

     if (left < n) {

       help(cur + "(", left + 1, right)
     }

     if (right < left) {

       help(cur + ")", left, right + 1);
     }

}
help("", 0, 0)
return res
}

/\*\*

- @param {number} n
- @return {string[]}
  \*/

## 括号组合

var res = generateParenthesis(3)

console.log(res)
var generateParenthesis = function(n) {

    /**F(n) =  for(k:0 -> n-1){ arr.push( '('+F(k)+')' +  F(n-1-k) ) }
     * @param {number} n
     * @return {string[]}
     */
    function F(n){
        if(list[n]){
            return list[n]
        }
        if(n==0 || n==1){
            list[0] = [''];
            list[1] = ['()']
            return list[n];
        }
        var result = [];
        for(let i = 0; i<=n-1; i++){ //最后一对括号的 需要括的括号数目
            let preF = F(i);
            let aftF = F(n-1-i);
            for(let k=0;k<preF.length;k++){
                let currentPre = '('+preF[k]+')';
                for(let j=0; j<aftF.length; j++){ //括了i个括号后，剩余n-1-i个括号需要组合
                    result.push(currentPre+aftF[j]);
                }
            }
        }
        list[n] = result;
        return list[n];
    }
    // 回溯法方程
    /**trackback()
     * @param {number} n
     * @return {string[]}
     */
    function trackback(n) {
    var LR = [n, n] //存剩余的左右括号个数
    var result = bracket(LR, '');
    /**bracket(LR)
     * @param {number[]} LR
     * @param {string} current 下一层的选择
     * @return {string[]} 存放从叶子节点到该层的 拼接的括号 组
     */
    function bracket(LR, current) {
      var currentLR = [...LR];
      var LeftArr = [];
      var rightArr = [];
      if (currentLR[0] > currentLR[1]) {
        return [];
      } else if (currentLR[1] == 0) {
        return [')']
      } else {
        if (currentLR[0] == 0) {
          //左边为0，右边不为0 向右→走
          currentLR[1]--;
          rightArr = bracket(currentLR, ')');
          for (let i = 0; i < rightArr.length; i++) {
            rightArr[i] = current + rightArr[i]
          }
          return rightArr
        } else {
          //左边右边都不为0
          currentLR[0]--;
          LeftArr = bracket(currentLR, '(');
          for (let i = 0; i < LeftArr.length; i++) {
            LeftArr[i] = current + LeftArr[i]
          };
          currentLR[0]++;
          currentLR[1]--;
          rightArr = bracket(currentLR, ')');
          for (let i = 0; i < rightArr.length; i++) {
            rightArr[i] = current + rightArr[i]
          }
          return LeftArr.concat(rightArr);
        }
      }
    }
    return result;

}

    //动态规划法：
    var list = new Array(n+1); //记录F(0)->F(n)的结果 每项都是 string[]。避免重复计算提高效率
    var result = F(n);
    return result;
    // 回溯法
    // var trackbackResult = trackback(n);
    // return trackbackResult

}
var res = generateParenthesis(3)
console.log(res)

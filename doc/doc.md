# 单词缩写
|全称|缩写|意义|
|:-:|:-:|:-:|
|background|bg|背景|
|button|btn|按钮|
|change|ch|改变|
|column|col|列|
|count|cnt|计数|
|current|cur|当前的|
|index|idx|索引|
|initialize|init|初始化|
|height|h|高度|
|horizontal|h|水平的|
|length|l|长度|
|position|pos|位置，索引|
|previous|prev|前面的|
|return value|ret|返回值|
|sequence|seq|序列|
|to|2|映射到|
|value|val|值|
|vertical|v|垂直的|
|width|w|宽度|
# 前端开发文档
## JS命名
1. 单词链接：驼峰命名法，如`redApple`
2. 私有函数和变量：以`_`开头
3. 何时用getter和setter：函数内只有一条简单语句，如返回某个值和赋值语句，其它的则用`getXX`和`setXX`命名的普通函数
## CSS命名
1. 以`-`连接，如`play-btn`
## api 接口
### Config
- 用途：存储各种用于各个组件贡献的数据，使用`getter`和`setter`接口
- 变量说明：见`Config.js`文件的注释
### Color
- 用途：存储各种用于绘制`canvas`的颜色
### Painter
- 用途：提供调用绘制`canvas`的函数
- API：
    - `drawBackground()`：绘制背景
    - `drawLines()`：绘制网格线
    - `drawCell(col, row)`：绘制第`col`列第`row`行的小格子
    - `drawColCells(col)`：绘制第`col`列所有小格子
    - `drawAllCells`：绘制`canvas`上所有的小格子
    - `redraw`：重新绘制整个`canvas`，包括背景、网格线和所有小格子
### Rule
- 用途：提供音乐与小格子之间的相互映射
- API
    - `getClickedRow(col)`：获取第`col`列被点击（选择）的行号
    - `getColNote(col)`：获取第`col`列被点击（选择）的音符
    - `getNote(col, row)`：获取第`col`列第`row`行的音符，如果该小格子没有被点击（选择）的话，返回`Rest`
    - `getNoteSeq()`：获取整个网格所表示的音符序列，以列号为索引
    - `setNoteSeq(noteSeq)`：设置网格的音符序列为`noteSeq`，以列号为索引
    - `click(col, row)`：表示第`col`列`row`行被点击，将点击事件存储为内部数据
### Controller
- 用途：用于控制网格与外界的交互，如滚动条的相应变化、播放、停止、接受新的音符序列
- 交互原理：通过让`document`发射自定义事件，然后让`document`监听自定义事件，进行相应的处理
- API：
    - `waitTime`：可读可写，两个音符播放时的时间间隔
    - `isPlaying()`：返回`Boolean`，表示当前是否正在播放
    - `resize()`：当`canvas`大小发生改变的时候调用，使其自动适应窗口大小的变化
    - `reset()`：当接收新的音符序列的时候调用，使其自动适应内容（音符序列）大小的变化
    - `setOffsetX(ratio)`：设置网格在x轴的偏移量占整个内容宽度的`ratio`
    - `setOffsetY(ratio)`：设置网格在y轴的偏移量占整个内容高度的`ratio`
    - `play()`：进行播放
    - `stop()`：停止播放
- 产生的自定义事件
    - `play`：表示开始进行播放
    - `stop`：表示停止播放
    - `gridOffsetXCh`：表示网格在x轴的偏移量发生改变
        - `ratio`：设置网格在x轴的偏移量占整个内容宽度的`ratio`
    - `gridOffsetYCh`：表示网格在y轴的偏移量发生改变
        - `ratio`：设置网格在y轴的偏移量占整个内容高度的`ratio`
    - `gridScrollWCh`：表示网格接受新的音乐序列，内容宽度发生了改变
        - `posRatio`: 新的x轴偏移的占比，也就是横向滚动条距离左边的占比
        - `sliderRatio`：新的可视区宽度比内容宽度，也就是横向滚动条长度的占比
    - `gridScrollHCh`：表示网格接受新的音乐序列，内容高度发生了改变
        - `posRatio`: 新的y轴偏移的占比，也就是纵向滚动条距离上边的占比
        - `sliderRatio`：新的可视区高度比内容高度，也就是纵向滚动条长度的占比
### Grid
- 用途：一个集成了`Player`、`Painter`、`Controller`、`Rule`、`Color`、`Config`的类
- API：它的接口只是简单使用内部类的巨口
    - `isPlaying()`：返回`Boolean`，表示当前是否正在播放
    - `setOffsetX(ratio)`：设置网格在x轴的偏移量占整个内容宽度的`ratio`
    - `setOffsetY(ratio)`：设置网格在y轴的偏移量占整个内容高度的`ratio`
    - `play()`：进行播放
    - `stop()`：停止播放
    - `getNoteSeq()`：获取整个网格所表示的音符序列，以列号为索引
    - `setNoteSeq(noteSeq)`：设置网格的音符序列为`noteSeq`，以列号为索引
    - `waitTime`：可读可写，两个音符播放时的时间间隔
    - `scrollW`：可读，内容区的宽度
    - `scrollH`：可读，内容区的高度
    - `visibleW`：可读，可视区的宽度
    - `visibleH`：可读，可视区的高度
    - `resize()`：当`canvas`大小发生改变的时候调用，使其自动适应窗口大小的变化

### ScrollBarH和ScrollBarV
- 用途：表示滚动条
- API
    - `resize()`：当窗口大小发生改变的时候调用，使其自动适应窗口大小的变化
    - `reset(posRatio, sliderRatio)`：当其主体的可视区/内容区占比发生变化时，使其自动适应大小的变化
        - `posRatio`：滚动条位置偏移的占比
        - `sliderRatio`：滑块长度的占比
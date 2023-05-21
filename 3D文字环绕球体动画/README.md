# 3D文字环绕球体动画

## 实现思路
### 计算球体表面顶点坐标
球体表面由许多顶点组成，每个顶点都位于球体表面上。使用球坐标系来计算球体表面上的顶点位置。球坐标系使用半径（r）、极角（θ）和方位角（φ）来描述一个点在球体上的位置。

给定球体的半径r，极角θ和方位角φ，球体表面上的点的坐标可以用js代码这样编写：
```js
const r = 10; // 半径
const phi = Math.random() * Math.PI; // 极角：从北极到南极（取值范围0到π），其中0代表北极，π代表南极
const theta = Math.random() * 2 * Math.PI; // 方位角：代表水平方向旋转角度
const x = r * Math.sin(phi) * Math.cos(theta);
const y = r * Math.sin(phi) * Math.sin(theta);
const z = r * Math.cos(phi);
```
通过组合极角和方位角，可以确定球体表面上的每个点的位置。


## 问题点
### 1.中文乱码
原因是字体不支持中文。下载支持中文的字体，并将字体转换成JSON文件。
http://gero3.github.io/facetype.js/

### 2.字体JSON大，卡顿

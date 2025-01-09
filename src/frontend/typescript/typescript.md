---
order: 1
title: TypeScript介绍
category:
  - 前端
  - TypeScript

---

###  1. TypeScript 是什么

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109152636664.png)

### 2. TypeScript 为什么要为 JS 添加类型支持？

**背景**：JS 的类型系统存在“先天缺陷”，JS 代码中绝大部分错误都是类型错误（Uncaught TypeError）。 

**问题**：增加了找 Bug、改 Bug 的时间，严重影响开发效率。 

从编程语言的动静来区分，TypeScript 属于静态类型的编程语言，JS 属于动态类型的编程语言。 

静态类型：编译期做类型检查； 动态类型：执行期做类型检查。 

代码编译和代码执行的顺序：1 编译 2 执行。 

对于 JS 来说：需要等到代码真正去执行的时候才能发现错误（晚）。 

对于 TS 来说：在代码编译的时候（代码执行前）就可以发现错误（早）。 

并且，配合 VSCode 等开发工具，TS 可以提前到在编写代码的同时就发现代码中的错误，减少找 Bug、改 Bug 时间

### 3.  TypeScript 相比 JS 的优势

1. 更早（写代码的同时）发现错误，减少找 Bug、改 Bug 时间，提升开发效率。
2. 序中任何位置的代码都有代码提示，随时随地的安全感，增强了开发体验。 
3. 强大的类型系统提升了代码的可维护性，使得重构代码更加容易。 
4. 支持最新的 ECMAScript 语法，优先体验最新的语法，让你走在前端技术的最前沿。 
5. TS 类型推断机制，不需要在代码中的每个地方都显示标注类型，让你在享受优势的同时，尽量降低了成本。 

除此之外，Vue 3 源码使用 TS 重写、Angular 默认支持 TS、React 与 TS 完美配合，TypeScript 已成为大中型前端 项目的首先编程语言。

### 4.  安装编译 TS 的工具包

Node.js/浏览器，只认识 JS 代码，不认识 TS 代码。需要先将 TS 代码转化为 JS 代码，然后才能运行。

安装命令：`npm i -g typescript`。 

typescript 包：用来编译 `TS` 代码的包，提供了 `tsc` 命令，实现了 `TS -> JS` 的转化。 

验证是否安装成功：`tsc –v`（查看 `typescript` 的版本）。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109153312156.png)

### 5. 编译并运行 TS 代码

1. 创建 hello.ts 文件（注意：TS 文件的后缀名为 .ts）。 
2. 将 TS 编译为 JS：在终端中输入命令，tsc hello.ts（此时，在同级目录中会出现一个同名的 JS 文件）。 
3. 执行 JS 代码：在终端中输入命令，node hello.js

```typescript
console.log('Hello ts')
let age: number = 18
console.log(age)
```

再看一下对应的js文件:

```js
console.log('Hello ts');
var age = 18;
console.log(age);
```

确实没有`类型语句`了

注意：<span style="color:red;">约定了什么类型，就只能给变量赋值该类型的值</span>，否则，就会报错。

**简化方式**：使用 ts-node 包，然后执行`ts-node hello.ts`，`ts-node` 命令在内部偷偷的将 `TS -> JS`，然后，再运行 JS 代码。

先安装包：`npm i -g ts-node`（`ts-node`包提供了 `ts-node` 命令）

==但是要注意==，根目录得初始化一个`tsconfig.json` 配置文件才行 ，初始化方式：`npx tsc --init`

### 6. 小对比

```js
//js报错
let count = 18
count = '20'
count.toFixed()
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109203716837.png)

然而ts已经报错了

### 7. 常用基础类型

1. JS 已有类型 
   - 原始类型：number/string/boolean/null/undefined/symbol。
   - 对象类型：object（包括，数组、对象、函数等对象）。 
2. TS 新增类型
   - 联合类型、自定义类型（类型别名）、接口、元组、字面量类型、枚举、void、any 等。

### 8. 数组类型

```typescript
let numbers: number[] = [1, 3, 5]
let numbers1: Array<number> = [1, 3, 5] //啰嗦，不推荐
let b: boolean[] = [true, false]
// 联合类型（有竖线）：
//数组中既有又有
let arr: (number | string)[] = [1, 3, 5, 'a', 'b']
//既可以是num类型，又可以是str[]数组类型
let arr1: number | string[] = ['a', 'b']
let arr1: number | string[] = 123
```

### 9. 类型别名

<span style="color:red;">类型别名</span>（自定义类型）：为任意类型起别名。 使用场景：当同一类型（复杂）被多次使用时，可以通过类型别名，简化该类型的使用。

```typescript
type CustomArray = (number | string)[]
let arr1: CustomArray = [1, 3, 5, 'a', 'b']
let arr2: CustomArray = [1, 'x', 2, 'y']
```

### 10.  函数类型

函数的类型实际上指的是：<span style="color:red;">函数参数</span>和<span style="color:red;">返回值</span>的类型。

```typescript
// 1. 单独指定参数、返回值类型：
function add(num1: number, num2: number): number { //函数声明方式
  return num1 + num2
}

const add = (num1: number, num2: number): number => { //函数表达式方式
  return num1 + num2
}

console.log(add(3, 2))

// 2. 同时指定参数、返回值类型：
const add: (num1: number, num2: number) => number = (num1, num2) => { //
  return num1 + num2
}
//注意：这种形式只适用于函数表达式。

// 3. 如果函数没有返回值，那么，函数返回值类型为：void。
function greet(name: string): void {
  console.log('Hello', name)
}
greet('jack')

// 4. 可传可不传参数
function mySlice(start: number, end?: number): void { //说可选参数后面不能再出现必选参数
  console.log('起始索引：', start, '结束索引：', end)
}
mySlice(10)
mySlice(1)
```

### 11. 对象类型

```typescript
// let person: { name: string; age: number; sayHi(): void; greet(name: string): void } = {
//   name: '刘老师',
//   age: 18,
//   sayHi() {},
//   greet(name) {}
// }

let person: {
  name: string
  age: number
  // sayHi(): void
  sayHi: () => void
  greet(name: string): void
} = {
  name: '刘老师',
  age: 18,
  sayHi() {},
  greet(name) {}
}
```

### 12. 对象可选属性

对象的属性或方法，也可以是可选的，此时就用到可选属性了。 

比如，我们在使用 axios({ … }) 时，如果发送 GET 请求，method 属性就可以省略。

```typescript
function myAxios(config: { url: string; method?: string }) {}
myAxios({
  url: ''
})
//？不写，就成必选的了!
```

### 13. 接口

相当于Java中的类

```typescript
// let person: { name: string; age: number; sayHi(): void } = {
//   name: '刘老师',
//   age: 18,
//   sayHi() {}
// }

// let person1: { name: string; age: number; sayHi(): void }

// 上面那个又繁琐了
// 接口：
interface IPerson {
  name: string
  age: number
  sayHi(): void
}

let person: IPerson = {
  name: '刘老师',
  age: 18,
  sayHi() {}
}

let person1: IPerson = {
  name: 'jack',
  age: 16,
  sayHi() {}
}
```

### 14. interface（接口）和 type（类型别名）的对比

相同点：都可以给对象指定类型。 

不同点： 

- 接口，只能为对象指定类型。 
- 类型别名，不仅可以为对象指定类型，实际上可以为任意类型指定别名。

```typescript
// 接口：
// interface IPerson {
//   name: string
//   age: number
//   sayHi(): void
// }

// 类型别名
type IPerson = {
  name: string
  age: number
  sayHi(): void
}

let person: IPerson = {
  name: '刘老师',
  age: 18,
  sayHi() {}
}
```

### 15. 接口继承

如果两个接口之间有相同的属性或方法，可以将公共的属性或方法抽离出来，通过继承来实现复用。 

比如，这两个接口都有 x、y 两个属性，重复写两次，可以，但很繁琐。

```typescript
interface Point2D { x: number; y: number}
interface Point3D { x: number; y: number; z: number }

// 使用 继承 实现复用：
interface Point3D extends Point2D {
  z: number
}

let p3: Point3D = {
  x: 1,
  y: 0,
  z: 0
}
```

### 16.  元组

场景：在地图中，使用经纬度坐标来标记位置信息。 

可以使用数组来记录坐标，那么，该数组中只有两个元素，并且这两个元素都是数值类型。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109234105553.png)

使用 number[] 的缺点：不严谨，因为该类型的数组中可以出现任意多个数字。 

更好的方式：元组（Tuple）。 

元组类型是另一种类型的数组，它确切地知道包含多少个元素，以及特定索引对应的类型。

```typescript
let position: [number, string] = [39, '114']
```

元组类型可以确切地标记出有多少个元素，以及每个元素的类型。

### 17. 类型推论

在 TS 中，某些没有明确指出类型的地方，TS 的类型推论机制会帮助提供类型。 

换句话说：由于类型推论的存在，这些地方，类型注解可以省略不写！ 

发生类型推论的 2 种常见场景：1 声明变量==并初始化时== 2 决定函数返回值时。

```typescript
// 声明变量并立即初始化值，此时，可以省略类型注解
let age = 18
```

```typescript
// 注意：如果声明变量但没有立即初始化值，此时，还必须手动添加类型注解
let a: number
a = 19
```

```typescript
function add(num1: number, num2: number) {
  return num1 + num2
}
add(1, 3)
function add(num1, num2: number) { //推荐写上类型
  return num1 + num2
}
add(1, 3)
add(false, 3)
```

### 18. 类型断言

有时候你会比 TS 更加明确一个值的类型，此时，可以使用类型断言来指定更具体的类型。 比如，

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250110000447082.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250110000551344.png)

注意：getElementById 方法返回值的类型是 HTMLElement，该类型只包含所有标签公共的属性或方法，不包含 a 标签特有的 href 等属性。 

因此，这个类型太宽泛（不具体），无法操作 href 等 a 标签特有的属性或方法。 

解决方式：这种情况下就需要使用类型断言指定更加具体的类型。

```typescript
const aLink = document.getElementById('link') as HTMLAnchorElement
// const aLink = <HTMLAnchorElement>document.getElementById('link') 不常用，原因是跟react冲突
aLink.href
```

解释： 

1. 使用 as 关键字实现类型断言。 
2. 关键字 as 后面的类型是一个更加具体的类型（HTMLAnchorElement 是 HTMLElement 的子类型）。 
3. 通过类型断言，aLink 的类型变得更加具体，这样就可以访问 a 标签特有的属性或方法了。

==技巧==：在浏览器控制台，通过 `console.dir($0)` 打印 DOM 元素，在属性列表的最后面，即可看到该元素的类型。
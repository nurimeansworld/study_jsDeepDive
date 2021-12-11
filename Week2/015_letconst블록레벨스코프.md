# 15. let, const 키워드와 블록 레벨 스코프

## 15.1 var 키워드로 선언한 변수의 문제점

### 15.1.1 변수 중복 선언 허용

```jsx
var x = 1;
var y = 1;

// var 키워드로 선언된 변수는 같은 스코프 내에서 중복 선언을 허용한다.
// 초기화문이 있는 변수 선언문은 자바스크립트 엔진에 의해 var 키워드가 없는 것처럼 동작한다.
var x = 100;
// 초기화문이 없는 변수 선언문은 무시된다. (중복 시에)
var y;

console.log(x); // 100
console.log(y); // 1
```

```jsx
//초기화문이 없는 변수 선언문은 무시된다.(중복 시에)

//1번 케이스
console.log(y)// undefined
var y;
console.log(y) // undefined

//2번 케이스
var y = 30;
console.log(y) // 30
var y = 100;
console.log(y) // 100

//3번 케이스 (무시 케이스)
var y = 30;
console.log(y) // 30
var y;                      //초기화문이 없어서
console.log(y) // 30

```

var 단점 - 의도치 않게 먼저 선언된 변수 값이 변경되는 부작용이 발생한다

### 15.1.2 함수 레벨 스코프

var 키워드로 선언한 변수는 수많은 코드 블럭 중 함수의 코드 블록만을 지역 스코프로 인정한다.
(함수 제외)코드 블록 내에서 var 키워드로 선언한 변수는 모두 전역 변수가 된다.
var 단점 - 의도치 않게 전역 변수를 중복선언할 가능성을 높인다.

```jsx
var x = 1;

if (true) {
  // x는 전역 변수다. 이미 선언된 전역 변수 x가 있으므로 x 변수는 중복 선언된다.
  // 이는 의도치 않게 변수값이 변경되는 부작용을 발생시킨다.
  var x = 10;
}

console.log(x); // 10
```

### 15.1.3 변수 호이스팅

4.변수
- 변수 호이스팅 : 변수 선언문이 코드의 선두로 끌어 올려진 것처럼 동작하는 자바스크립트 고유의 특징
(var, let, const, function, function*, class 키워드를 사용해서 선언하는 모든 식별자는 호이스팅된다.)

-변수 선언과 값의 할당:
변수 선언과 값의 할당을 하나의 문으로 단축 표현해도 각각 2개로 나누어 실행
변수 선언과 값의 할당 시점은 다름

```jsx
var score; // 변수 선언
score = 80; // 값의 할당

var score = 80; // 변수 선언과 값의 할당
```

var 키워드로 변수를 선언하면 변수 호이스팅에 의해 변수 선언문이 스코프의 선두로 끌어 올려진 것처럼 동작한다. 즉, 변수 호이스팅에 의해 var 키워드로 선언한 변수는 변수 선언문 이전에 참조 할 수 있다.

단, 할당문 이전에 변수를 참조하면 언제나 undefined를 반환한다.

```jsx
// 이 시점에는 변수 호이스팅에 의해 이미 foo 변수가 선언되었다.(1. 선언 단계)
// 변수 foo는 undefined로 초기화 된다(2. 초기화 단계)
console.log(foo); // undefined

// 변수에 값을 할당(3. 할당 단계)
foo = 123;

console.log(foo); // 123

// 변수 선언은 런타임 이전에 자바스크립트 엔진에 의해 암묵적으로 실행된다.
var foo;
```

## 15.2 let 키워드

### 15.2.1 변수 중복 선언 금지

var: 이름이 동일한 변수 중복선언가능, 중복선언하면서 재할당 가능

let: 중복선언 불가

```jsx
var foo = 123;
// var 키워드로 선언된 변수는 같은 스코프 내에서 중복 선언을 허용한다.
// 아래 변수 선언문은 자바스크립트 엔진에 의해 var 키워드가 없는 것처럼 동작한다.
var foo = 456;

let bar = 123;
// let 이나 const 키워드로 선언된 변수는 같은 스코프 내에서 중복 선언을 허용하지 않는다.
let bar = 456; // SyntaxError: Identifier 'bar' has already been declared
```

### 15.2.2 블록 레벨 스코프

let 키워드로 선언한 변수는 모든 코드 블록(함수, if 문, for 문, while 문, try/catch 문 등)을 지역 스코프로 인정하는 블록 레벨 스코프(block-level scope)

```jsx
let foo = 1; // 전역 변수

{
  let foo = 2; // 지역 변수
  let bar = 3; // 지역 변수
}

console.log(foo); // 1
console.log(bar); // ReferenceError: bar is not defined
```

이때 함수 내의 코드 블록은 함수 레벨 스코프에 중첩된다.

```jsx
let i = 10; // 전역 스코프

function foo() {
  let i = 100;

  for(let i = 1; i < 3; i++) {
    console.log(i); // 1 2 블록 레벨 스코프
  }
  console.log(i); // 100 함수 레벨 스코프
}
foo();

console.log(i); // 10 전역 스코프
```

### 15.2.3 변수 호이스팅

let 키워드로 선언한 변수는 마치 변수 호이스팅이 발생하지 않는 것처럼 동작한다.

```jsx
console.log(foo); // ReferenceError: foo is not defined
let foo;
```

```jsx
console.log(foo); // undefined  (호이스팅 - 1.선언 2. 초기화)

var foo;
console.log(foo); // undefined

foo = 1; // 할당문에서 할당 단게가 실행된다. (할당문 3.할당)
console.log(foo); // 1
```

```jsx
// 런타임 이전에 선언 단계가 실행된다. 아직 변수가 초기화 되지 않았다.
// 초기화 이전의 일시적 사각지대에서는 변수를 참조할 수 없다.
console.log(foo); // ReferenceError: foo is not defined
									// (호이스팅 - 1.선언 &&사각지대)

let foo; // (변수 선언문 - 2. 초기화)
console.log(foo); // undefined

foo = 1; // 할당문에서 할당 단계가 실행된다. (할당문 - 3.할당)
console.log(foo); // 1
```

- let 키워드로 선언한 변수는 "선언 단계"와 "초기화 단계"가 분리되어 진행됨.
- 초기화 단계는 변수 선언문에 도달했을 때 실행.
- 스코프의 시작 지점부터 초기화 시작 지점까지 변수를 참조할 수 없는 구간을

일시적 사각지대(Temporal Dead Zone:TDZ) 라고 부름

결국 let 키워드로 선언한 변수는 변수 호이스팅이 발생하지 않는 것처럼 보이지만 그렇지 않다.

```jsx
let foo  = 1;
{
  console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
  let foo = 2; // 지역 변수
}
```

변수 호이스팅이 발생하지 않는다면 위 예제는 전역 변수 foo의 값을 출력해야 함.

하지만 let 키워드로 선언한 변수도 여전히 호이스팅이 발생하기 때문에 참조 에러가 발생.

## 15.3 const 키워드

const 키워드는 상수(constant)를 선언하기 위해 사용한다. 하지만 반드시 상수만을 위해 사용하지 않는다.

### 15.3.1 선언과 초기화

**const 키워드는 선언한 변수는 반드시 선언과 동시에 초기화해야 한다.**

```jsx
const foo = 1;

const doo; // SyntaxError: Missing initializer in const declaration
```

const 키워드로 선언한 변수는 let 키워드와 마찬가지로 블록 레벨 스코프를 가지며,

변수 호이스팅이 발생하지 않는 것처럼 동작한다.

```jsx
{
  // 변수 호이스팅이 발생하지 않는 것처럼 동작한다
  console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
  const foo = 1;
  console.log(foo); // 1
}

// 블록 레벨 스코프를 갖는다.
console.log(foo); // ReferenceError: foo is not defined
```

### 15.3.2 재할당 금지

**const 키워드로 선언한 변수는 재할당이 금지된다.**

```jsx
const foo = 1;
foo = 2; // TypeError: Assignment to constant variable
```

const 키워드로 선언된 변수에 값을 변경할 수 없는 경우 :  원시값을 할당한 경우

1. 원시값은 재할당 이외에 변경할 방법이 없고

b.  const는 재할당이 금지되므로

할당된 값을 변경할 수 없다.

### 15.3.3 상수

상수는 재할당이 금지된 변수를 말한다.

const 키워드로 선언된 변수에 원시 값을 할당한 경우 원시 값은 변경할 수 없는 값(immutable value)이고 const 키워드에 의해 재할당이 금지되므로 할당된 값을 변경할 수 있는 방법은 없다.

상수는 상태유지, 가독성, 유지보수의 편의를 위해 적극적으로 사용해야한다.

### 15.3.4 const 키워드와 객체

**const 키워드로 선언된 변수에 값을 변경할 수 있는 경우 : 객체를 할당한 경우**

객체는 재할당없이도 변경 가능함

```jsx
const person = {
  name: 'Lee'
};

// 객체는 변경 가능한 값이다. 따라서 재할당 없이 변경이 가능하다.
person.name = 'Kim'; //갱신

console.log(person); // {name: 'Kim'}
```

***const 키워드는 재할당을 금지할 뿐 "불변"을 의미하지는 않는다.***

## 15.4 var vs let vs const

var 키워드는 사용하지 않는다.

재할당이 필요한 경우에 한정해 let 키워드를 사용한다. 이 때 변수의 스코프는 최대한 좁게 만든다.

const>let>var 순으로 사용. (양의 의미가 아님)
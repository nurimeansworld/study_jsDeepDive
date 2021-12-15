## 클로저
```js
const x = 1;
function outerFunc() {
  const x = 10;

  function innerFunc() {
    console.log(x); // 10
  }

  innerFunc();
}

outerFunc();
```
- `outerFunc` 함수 내부에서 중첩 함수 `innerFunc`가 정의되고 호출됐다.
- `innerFunc`의 상위 스코프는 외부 함수 `outerFunc`의 스코프이므로 `innerFunc` 함수 내부에서 `outerFunc`함수의 `x`변수에 접근할 수 있다.
```js
const x = 1;
function outerFunc() {
  const x = 10;

  innerFunc();
}

function innerFunc() {
  console.log(x); // 1
}

outerFunc();
```
- `innerFunc`는 `outerFunc` 내부에서 호출되었지만 **정의는 전역**에서 되었으므로 `outerFunc`의 `x`변수에 접근할 수 없다.
- 이 같은 현상이 발생하는 이유는 **렉시컬 스코프** 때문이며 클로저를 잘 이해하기 위해서는 **함수가 선언된 렉시컬 환경**을 알아야한다고 한다.

그렇다면 **렉시컬 스코프**란 무엇일까.

### 렉시컬 스코프
- 함수가 어디에서 호출되었는지는 상위 스코프 결정에 전혀 영향을 주지 않는다. 즉, **함수의 상위 스코프는 함수가 정의되는 위치에 의해 결정**되며 이것을  **렉시컬 스코프(=정적 스코프)** 라고 부른다.


### 함수 객체의 내부 슬롯 [[Environment]]
- 렉시컬 스코프가 가능하려면 함수는 자신이 정의된 환경(=상위 스코프)을 **기억**해야 한다.
- 그래서 함수는 자신의 내부 슬롯 `[[Environment]]`에 상위 스코프의 참조를 저장한다.
- `[[Environment]]`에 저장된 상위 스코프의 참조는 현재 실행 중인 실행 컨텍스트의 렉시컬 환경을 가리킨다.
```js
const x = 1;

function foo() {
  const x = 10;
  bar();
}

function bar() {
  console.log(x);
}

foo(); // 1
bar(); // 1
```
- `foo` 함수와 `bar`함수는 모두 전역에서 정의되었다.
- 따라서 두 함수의 `[[Environmnet]]` 슬롯에는 전역 렉시컬 환경의 참조가 저장된다.


### 클로저와 렉시컬 환경
```js
const x = 1;

// --> 1
function outer() {
  const x = 10;
  const inner = function (){ console.log(x); }; // --> 2
  return inner;
}

const innerFunc = outer(); // --> 3
innerFunc(); // --> 4, 결과: 10
```
- 3에서 `outer` 함수를 호출하면 `outer` 함수는 중첩함수인 `inner` 함수를 반환하고 실행 컨텍스트 스택에서 제거된다. (=생명주기 마감)
- 이 때 `outer` 함수의 지역 변수 `x`와 변수 값 10을 저장하고 있던 `outer`함수의 실행 컨텍스트가 제거되었으므로 `outer`함수의 `x` 변수에 접근할 방법은 없다.
- 그러나 4의 결과는 `outer`함수의 지역 변수 `x`의 값인 10이다.
- 결과가 왜 이렇게 나왔는가?
  - `inner`함수는 자신이 평가될 때 `[[Environment]]` 슬롯에 자신이 정의된 위치인 `outer` 함수의 렉시컬 환경에 대한 참조를 저장한다.
  - `outer`함수의 실행이 종료되면 `outer`함수 실행 컨텍스트는 실행 컨텍스트 스택에서 제거되지만 `outer`함수의 렉시컬 환경까지 소멸하는 것은 아니다.
  - `outer`함수의 렉시컬 환경은 `inner` 함수의 `[[Environment]]`슬롯에서 참조하고 있기 때문에 메모리 공간을 해제하지 않는다.
  - 따라서 `inner`함수는 `outer`함수의 `x`변수를 참조할 수 있다. 
- **외부 함수보다 중첩 함수가 더 오래 유지되는 경우 중첩 함수는 이미 생명 주기가 종료한 외부 함수의 변수를 참조할 수 있다.**
- 이때 생명 주기가 종료된 외부 함수에 접근 할 수 있는 중첩 함수를 **클로저**라고 한다.
```js
function foo(){
  const x = 1;
  const y = 2;

  function bar() {
    const z = 3;
    console.log(z); // 상위 스코프의 식별자를 참조하지 않는다.
  }

  return bar();
}
const bar = foo();
bar();
```
- `bar`함수는 `foo`함수 보다 더 오래 유지 되지만 상위 스코프의 어떤 식별자도 참조하지 않는다. 
- 이처럼 상위 스코프의 어떤 식별자도 참조하지 않는 경우 대부분의 모던 브라우저는 최적화를 통해 상위 스코프를 기억하지 않는다.
- 따라서 `bar`함수는 클로저라고 할 수 없다.
```js
function foo(){
  const x = 1;
  function bar(){
    console.log(x);
  }
  bar();
}

foo();
```
- `bar`함수는 `foo`함수의 식별자를 참조하고 있으므로 클로저다.
- 하지만 `foo`의 외부로 `bar`가 반환되지 않으므로 `bar`의 생명주기가 `foo`보다 짧다.
- 외부 함수보다 일찍 소멸되는 내부 함수는 클로저의 본질에 맞지 않다.
- 따라서 `bar`함수는 클로저라고 하지 않는다.
```js
function foo(){
  const x = 1;
  const y = 2;

  function bar(){
    console.log(x);
  }

  return bar();
}
const bar = foo();
bar();
```
- `bar`함수는 `foo`함수의 식별자를 참조하고 있으므로 클로저다.
- 그리고 `bar`함수는 외부로 반환되었기 때문에 생명주기가 `foo`함수보다 길다.
- 하지만 `bar`함수는 상위 스코프의 `x, y` 변수 중 `x`만 참조 하고 있다.
- 이런 경우 대부분의 모던 브라우저는 최적화를 통해 **상위 스코프 식별자 중 클로저가 참조하고 있는 식별자만을 기억한다.**
- 클로저에 의해 참조되는 상위 스코프의 변수를 **자유 변수**라고 부른다.
- 클로저(closure)란 **"자유 변수에 묶여있는 함수**라고 할 수 있다.

### 클로저의 활용
```js
let num = 0;

const increase = function () {
  return ++num;
};

console.log(increase()); // 1
console.log(increase()); // 2
console.log(increase()); // 3
```
- `num`은 전역 변수이므로 언제든지 누구나 접근하고 변경할 수 있다.
- 만약 누군가 의도치 않게 `num`의 값을 변경한다면 오류로 이어질 수 있다.
- 따라서 `num`은 `increase`함수만이 참조하고 변경할 수 있게 하는 게 좋다.
- `num`을 `increase`함수의 지역변수로 바꿔보자.
```js
const increase = function() {
  let num = 0;
  return ++num;
}
console.log(increase()); // 1
console.log(increase()); // 1
console.log(increase()); // 1
```
- 이제 `num` 변수는 `increase`함수만이 변경할 수 있다.
- 하지만 `increase` 함수가 호출될 때마다 `num`은 다시 0으로 초기화 된다.
- `num`이 이전 상태를 유지 할 수 없다.
- 클로저를 사용해보자.
```js
const increase = (function() {
  let num = 0;
  return function () {
    return ++num;
  }
}());

console.log(increase()); // 1
console.log(increase()); // 2
console.log(increase()); // 3
```
- `increase`변수에 할당된(=즉시 실행함수가 반환한) 함수는 상위 스코프의 렉시컬 환경을 기억하는 클로저다.
- 따라서 클로저는 자유 변수 `num`을 참조하고 변경할 수 있다.
- 즉시 실행 함수는 한 번만 실행되므로 `num`이 재차 0으로 초기화될 일은 없다.
- 또한 `num`변수는 외부에서 직접 접근할 수 없는 은닉(private)된 변수다.
- **이처럼 클로저는 상태가 의도치 않게 변경되지 않도록 안전하게 은닉하고 특정 함수에게만 상태 변경을 허용하여 상태를 안전하게 변경하고 유지하기 위해 사용한다.**
- 이제 `num`을 감소시킬 수 있도록 발전 시켜 보자.
```js
const counter = (function () {
  let num = 0;

  return {
    increase () {
      return ++num;
    },

    decrease () {
      return --num;
    }
  };
}());
console.log(counter.increase()); // 1
console.log(counter.increase()); // 2
console.log(counter.decrease()); // 1
console.log(counter.decrease()); // 0
```
- `increase`메서드와 `decrease`메서드는 메서드가 평가되는 시점에 상위 스코프의 렉시컬 환경을 기억한다. 따라서 `num`에 접근할 수 있다.
- 위 예제를 생성자 함수로 표현해 보자.
```js
const Counter = (function () {
  let num = 0; // --> 1

  function Counter(){
    // this.num = 0; --> 2
  }

  Counter.prototype.increase = function () {
    return ++num;
  }
  Counter.prototype.decrease = function () {
    return num > 0 ? --num : 0;
  }

  return Counter;
}());

const counter = new Counter();

console.log(counter.increase()); // 1
console.log(counter.increase()); // 2
console.log(counter.decrease()); // 1
console.log(counter.decrease()); // 0
```
- 1에서 `num`은 `Counter`가 생성할 인스턴스의 프로퍼티가 아니라 즉시 실행 함수 내에 선언된 변수이므로 외부에서 접근할 수 없다.
- 만약 `num`이 `Counter`가 생성할 인스턴스의 프로퍼티라면 인스턴스를 통해 외부에서 접근이 자유로워 진다.
- `increase`메서드와 `decrease`메서드는 메서드가 평가되는 시점에 상위 스코프의 렉시컬 환경을 기억한다. 따라서 `num`에 접근할 수 있다.

클로저를 활용하는 다른 예시를 살펴보자.
```js
function makeCounter(predicate){
  let counter = 0;

  return function () {
    counter = predicate(counter);
    return counter;
  };
}

function increase(n){
  return ++n;
}

function decrease(n) {
  return --n;
}

const increaser = makeCounter(increase); // --> 1
console.log(increaser()); // 1
console.log(increaser()); // 2

const decreaser = makeCounter(decrease); // --> 2
console.log(decreaser()); // -1
console.log(decreaser()); // -2
```
- `makeCounter`함수는 함수를 인자로 전달받는 고차 함수다.
- `makeCounter`함수가 반환하는 함수는 `counter` 변수를 기억하는 클로저다.
- `makeCounter` 함수를 호출하면 그 때마다 새로운 함수 렉시컬환경이 생성되기 때문에 **반환된 함수도 자신만의 독립된 렉시컬 환경을 갖는다.**
- `increaser`와 `decreaser`에 할당된 함수는 자신만의 독립된 렉시컬 환경을 갖기 때문에 자유 변수 `counter`를 공유하지 않는다.
- 따라서 두 함수가 연동된 카운터를 만드려면 **렉시컬 환경을 공유하는 클로저**를 만들어야 한다. 즉, `makeCounter`가 두 번 호출되지 않아야 한다.
```js
const counter = (function() {
  let counter = 0;

  return function (predicate) {
    counter = predicate(counter);
    return counter;
  };
}());

function increase(n){
  return ++n;
}

function decrease(n) {
  return --n;
}

console.log(counter(increaser)); // 1
console.log(counter(increaser)); // 2

console.log(counter(decreaser)); // 1
console.log(counter(decreaser)); // 0
```

### 캡슐화와 정보 은닉
- **캡슐화** : 객체의 상태를 나타내는 프로퍼티와 프로퍼티를 참조하고 조작할 수 있는 동작인 메서드를 하나로 묶는 것.
- 캡슐화는 객체의 특정 프로퍼티나 메서드를 외부로부터 감출 목적으로 사용하기도 하는데 이를 **정보 은닉**이라 한다.
```js
// 캡슐화
function Person(name, age) {
  this.name = name; // public
  let _age = age; // private, 정보 은닉

  this.sayHi = function () {
    console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
  };
}

const me = new Person('An', 26);
me.sayHi(); // Hi! My name is An. I am 26.
console.log(me.name); // An
console.log(me._age); // undefined

const you = new Person('Kim', 30);
you.sayHi(); // Hi! My name is Kim. I am 30.
console.log(you.name); // Kim
console.log(you._age); // undefined
```
- 자바스크립트 객체의 모든 프로퍼티와 메서드는 기본적으로 외부에 공개(public)되어 있다.
- `name` 프로퍼티는 외부로 공개되어 있어서 자유롭게 참조하거나 변강할 수 있다.
- `_age` 변수는 `Person` 생서자 함수의 지역 변수이므로 `Person` 함수 외부에서 참조하거나 변경할 수 없다. (private)
- `sayHi` 메서드는 인스턴스 메서드이므로 `Person`객체가 생성될 때 마다 중복 생성된다. 
- 중복 생성을 방지해 보자.
```js
const Person = (function () {
  let _age = 0; // private

  // 생성자 함수
  function Person(name, age){
    this.name = name; // public
    _age = age;
  }

  // 프로토타입 메서드
  Person.prototype.sayHi = function () {
    console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
  };

  return Person;
}());

const me = new Person('An', 26);
me.sayHi(); // Hi! My name is An. I am 26.
console.log(me.name); // An
console.log(me._age); // undefined

const you = new Person('Kim', 30);
you.sayHi(); // Hi! My name is Kim. I am 30.
console.log(you.name); // Kim
console.log(you._age); // undefined
```
- `Person.prototype.sayHi` 메서드는 즉시 실행 함수 안에서 정의되었으므로 자신의 상위 스코프인 즉시 실행 함수의 렉시컬 환경에 대한 참조를 `[[Environment]]`에 저장하여 기억한다.
- 때문에 `Person.prototype.sayHi`를 상속받는 모든 `Person` 생성자의 인스턴스는 동일한 상위 스코프를 사용하게 된다.
- 즉, 모든 인스턴스가 동일한 `_age`를 참조하고 변경할 수 있기 때문에 `_age`상태가 유지되지 않는 문제가 있다. (아래 코드 처럼)
```js
const me = new Person('An', 26);
me.sayHi(); // Hi! My name is An. I am 26.

const you = new Person('Kim', 30);
you.sayHi(); // Hi! My name is Kim. I am 30.

me.sayHi(); // Hi! My name is An. I am 30.
```
- 이처럼 자바스크립트는 정보 은닉을 완전하게 지원하지 않는다.
- (다시 정리보자면) 인스턴스 메서드를 사용하면 private을 흉내낼 수 있지만 같은 기능의 함수를 중복 생성하게 되고 프로토타입 메서드를 사용하면 생성한 인스턴스가 같은 변수를 공유하기 때문에 정보 은닉이 불가능하다.

### 자주 발생하는 실수
```js
var funcs = [];

for(var i = 0; i < 3; i++){
  funcs[i] = function () { return i; }; // --> 1
}

for(var j = 0; j < funcs.length ; j++){
  console.log(funcs[j]()); // --> 2
}
```
- 위 코드의 결과로 `0, 1, 2`를 기대했다면 아쉽지만 그렇지 않다.
- 1에서 함수가 `funcs` 배열의 요소로 추가된다. 이 때 추가되는 함수는 전역 에서 정의되었기 때문에 `[[Environment]]` 슬롯에 전역 렉시컬 환경에 대한 참조를 저장한다.
-  2 에서 `funcs` 배열 안의 함수를 차례로 호출 한다.
- 이 때 `funns`는 자신의 스코프에서 정의되지 않은 `i` 변수를 찾기 위해 상위 스코프인 전역 스코프를 살펴보게 된다.
- `i`는 `var`키워드로 선언된 변수로 블록 스코프를 갖지 않기 때문에 `for`문의 실행이 종료되어도 자신이 선언된 위치인 전역 스코프에서 전역 객체의 프로퍼티로 남아있다. 
- 따라서 `i`는 첫번째 `for`문을 나오면서 이미 3으로 변경 되었으므로 두번째 `for`문에서 `func[j]()`를 호출한 결과는 모두 3이 된다. (결과: `3, 3, 3`)
- 원하는 결과대로 나오게 해보자.
```js
var funcs = [];

for(var i = 0; i< 3; i++){
  funcs[i] = (function (id) { // --> 1
    return function () {
      return id;
    };
  }(i));
}

for(var j = 0; j < funcs.length ; j++){
  console.log(funcs[j]());
}
```
- 즉시 실행 함수의 매개변수 `id`는 전역 변수 `i`에 할당되어 있는 값을 인수로 전달 받는다.
- 즉시 실행 함수가 반환하는 중첩 함수는 자신의 상위 스코프를 기억하는 클로저이기 때문에 즉시 실행 함수가 종료된 이후에도 `id`를 참조 할 수 있다.
- 사실 이 문제는 `let` 키워드를 사용하면 바로 해결된다.
```js
const funcs = [];

for(let i = 0; i < 3 ; i++){
  funcs[i] = function () { return i; };
}

for (let i = 0; i < funcs.length ; i++) {
  console.log(funcs[i]()); // 0 1 2
}
```
- `let` 키워드로 선언한 변수를 사용하면 `for`문의 코드 블록이 반복 될 때마다 새로운 렉시컬 환경이 생성된다.
- p.415의 그림 24-11을 참조하면 이해가 더 쉽다.
- 다른 방법으로는 **고차 함수**를 사용하는 방법이 있다.
```js
const funcs = Array.from(new Array(3), (_, i) => () => i); // [f, f, f]
funcs.forEach(f => console.log(f())); // 0 1 2
```
- `Array.from(배열로 변환하고자 하는유사 배열 객체나 반복 가능한 객체, 배열의 모든 요소에 대해 호출할 맵핑 함수)`
- [MDN Array.from()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
- `Array.from(obj, mapFn)`은 새로운 배열을 생성한다는 점만 빼면 `Array.from(obj).map(mapFn)`와 동일하게 작동한다.
```js
Array.from(new Array(3), (_, i) => () => i);
Array.from(new Array(3)).map((_, i) => () => i);
```
- `new Array(3)` : 길이가 3인 array를 만들거야.
- `(_, i) => () => i` : 새로 만든 array를 순회하면서 `() => i`를 매핑할거야.
```js
(_, 0) => () => 0; // array[0] = function () {return 0;};
(_, 1) => () => 1; // array[1] = function () {return 1;};
(_, 2) => () => 2; // array[2] = function () {return 2;};
```
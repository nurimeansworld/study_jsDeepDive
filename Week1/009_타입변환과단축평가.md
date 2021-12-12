## 타입 변환과 단축 평가
### 타입 변환이란?
- 개발자가 의도한 타입 변환 : **명시적 타입 변환** / **타입 캐스팅**
```js
var x = 10;
var str = x.toString(); // 명시적 타입 변환
console.log(typeof str, str); // string 10
console.log(typeof x, x); // number 10 , x값이 변한건 아니다.
```
- 자바스크립트 엔진에 의한 타입 변환 : **암묵적 타입 변환** / **타입 강제 변환**
```js
var x = 10;
var str = x + ''; // '10' + '' 으로 자동 변환하여 평가
console.log(typeof str, str); // string 10
```
<br>

### 암묵적 타입 변환
- 자바스크립트 엔진은 표현식을 **에러 없이 평가하기 위해** 피연산자의 값을 암묵적 타입 변환해 새로운 타입의 값을 만들어 단 한 번 사용하고 버린다.

#### 문자열 타입으로 변환
- `+` 연산자는 피연산자 중 하나 이상이 문자열이면 문자열 연결 연산자로 동작한다.
- 피연산자 중 문자열 타입이 아닌 피연산자를 문자열 타입으로 변환하다.
```js
// 숫자 타입
0 + ''; // '0'
-0 + ''; // '0'
1 + ''; // '1'
-1 + ''l // '-1'
NaN + ''; // 'NaN'
Infinity + ''; // 'Infinity'
-Infinity + ''; // '-Infinity'

// 불리언 타입
true + ''; // 'true'
false + ''; // 'false'

// null 타입
null + ''; // 'null'

//undefined 타입
undefined + ''; // 'undefined'

// 심벌 타입
(Symbol()) + ''; // TypeError: cannot convert a Symbol value to a string

// 객체 타입
({}) + ''; // '[object Object]'
Math + ''; // '[object Math]'
[] + ''; // ''
[10, 20] + ''; // '10, 20'
(function(){}) + ''; // 'function(){}'
Array + ''; // 'function Array() { [native code] }'
```
#### 숫자 타입으로 변환
- `-, *, /` 연산자는 산술 연산자로, 피연산자 중에서 숫자 타입이 아닌 피연산자를 숫자 타입으로 변환한다.
- 숫자 타입으로 변환할 수 없는 경우 `NaN`를 반환한다.
- 비교연산자(<,>,<=,>=)는 비교값이 문맥상 모두 숫자 타입이어야 하므로 피연산자를 숫자 타입으로 변환한다.
- `+` 단항 연산자도 피연산자를 숫자 타입으로 변환한다.
- 빈 문자열(''), 빈 배열([]), null, false는 0으로 변환한다.
- 객체와 빈 배열이 아닌 배열, undefined는 `NaN`이 된다.
```js
// 문자열 타입
+''; // 0
+'0'; // 0
+'1'; // 1
+'string'; // NaN

// 불리언 타입
+true; // 1
+false; // 0

// null 타입
+null; // 0

// undefined 타입
+undefined; // NaN

// 심벌 타입
+Symbol(); // TypeError: Cannot convert a Symbol value to a number

// 객체 타입
+{}; // NaN
+[]; // 0
+[10, 20]; // NaN
+(function(){}); // NaN

```
#### 불리언 타입으로 변환
- 조건식의 평가 결과를 불리언 타입으로 변환한다.
- 자바스크립트 엔진은 불리언 타입이 아닌 값을 **Trythy값(참으로 평가되는 값)** 또는 **Falsy값(거짓으로 평가되는 값)** 으로 구분한다.
- **Falsy값**: `false`, `undefined`, `null`, `0`, `-0`, `NaN`, `''`
  - 이 외는 모두 **Truthy값** 이다.
```js
if ('') console.log('1'); // F
if (true) console.log('2'); // T
if (0) console.log('3'); // F
if ('str') console.log('4'); // T
if (null) console.log('5'); // F
if ('0') console.log('6'); // T
if ({}) console.log('7'); // T
if ([]) console.log('8'); // T

// 2 4 6 7 8
```

<br>

### 명시적 타입 변환
#### 문자열 타입으로 변환하는 방법
1. String 생성자 함수를 new 연산자 없이 호출
2. Object.prototype.toString 메서드 사용
3. 문자열 연결 연산자 이용 (암묵적 타입 변환)
```js
// 1. String 생성자 함수를 new 연산자 없이 호출
String(1); // '1'
String(NaN); // 'NaN
String(Infinity); // 'Infinity'
String(true); // 'true'


// 2. Object.prototype.toString 메서드 사용
(1).toString(); // '1'
(NaN).toString();
(Infinity).toString();
(true).toString();

// 3. 문자열 연결 연산자 이용
1 + '';
NaN + '';
Infinity + '';
true + '';
```
#### 숫자 타입으로 변환하는 방법
1. Number 생성자 함수를 new 연산자 없이 호출
2. parseInt, parseFloat 함수 사용(문자열->숫자만 가능)
3. `+` 단항 산술 연산자 이용
4. `*` 산술 연산자 이용 ( ... * 1)
```js
// 1.  Number 생성자 함수를 new 연산자 없이 호출
Number('0'); // 0
Number('-1'); // -1
Number('10.53'); // 10.53
Number(true); // 1

// 2. parseInt, parseFloat 함수 사용
parseInt('0');
parseInt('-1');
parseFloat('10.53');

// 3. + 단항 산술 연산자 이용
+'0'; 
+'-1'; 
+'10.53'; 
+true;

// 4. * 산술 연산자 이용
'0' * 1;
'-1' * 1;
'10.53' * 1;
true * 1;
```

#### 불리언 타입으로 변환하는 방법
1. Boolean 생성자 함수를 new 연산자 없이 호출
2. `!` 부정 논리 연산자를 **두 번** 사용
```js
// 1. Boolean 생성자 함수를 new 연산자 없이 호출
Boolean('x'); // true
Boolean(''); // false
Boolean('false'); // true
Boolean(0); // false
Boolean(1); // true
Boolean(NaN); // false
Boolean(Infinity); // true
Boolean(null); // false
Boolean(undefined); // false
Boolean({}); // true
Boolean([]); // true

// 2. ! 부정 논리 연산자를 두 번 사용
!!'x';
!!'';
!!false;
!!0;
!!1;
!!NaN;
!!Infinity;
!!null;
!!undefined;
!!{};
!![];
```

<br>

### 단축 평가
#### 논리 연산자를 사용한 단축 평가
- 논리합(`||`) 또는 논리곱(`&&`) 연산자 표현식은 언제나 **2개의 피연산자 중 어느 한쪽**으로 평가된다.
- 논리 연산의 결과를 결정하는 피연산자의 타입을 변환하지 않고 **그대로** 반환한다. (단축 평가)
```js
'Cat' || 'Dog'; // 'Cat'
'Cat' && 'Dog'; // 'Dog'
```
- 논리합 연산자(`||`)는 논리 연산의 결과를 결정하는 첫번째 연산자('Cat')를 그대로 반환한다.
- 논리곱 연산자(`&&`)는 논리 연산의 결과를 결정하는 두번째 연산자('Dog')를 그대로 반환한다.

#### 단축평가의 유용한 패턴
- 객체를 가리키기를 기대하는 변수가 `null` 또는 `undefined`가 아닌지 확인하고 프로퍼티를 참조할 때
```js
var elem = null;
var value = elem.vale; // TypeError: Cannot read property 'value' of null


elem = null;
// elem이 null이나 undefined와 같은 Falsy 값이면 elem으로 평가되고
// elem이 Truthy 값이면 elem.value로 평가된다.
vale = elem && elem.value; // null
```
- 함수 매개변수에 기본값(default)을 설정할 때
```js
// 단축 평가를 사용한 매개변수의 기본값 설정
function getStringLength(str) {
  str = str || '';
  return str.length;
}

getStringLength(); // 0;
getStringLength('hi'); // 2

// ES6의 매개변수 기본값 설정
function getStringLength(str = '') {
  return str.length;
}

getStringLength(); // 0
getStringLength('hi');
```

#### 옵셔널 체이닝 연산자
- ES11(ECMAScript2020)에서 도입되었다.
- 옵셔널 체이닝 연산자 `?.`
- 좌항의 피연산자가 `null` 또는 `undefined`인 경우 `undefined`를 반환한다.
- 그렇지 않으면 우항의 **프로퍼티 참조**를 이어간다.
```js
var elem = null;

var value = elem?.value; 
console.log(value); // undefined, 좌항인 elem이 null이므로 undefined 반환

var str = '';
var length = str?.length;
console.log(length); // 0
``` 

#### null 병합 연산자
- ES11(ECMAScript2020)에서 도입되었다.
- null 병합 연산자 `??`
- 좌항의 피연산자가 `null` 또는 `undefined` 인 경우 우항의 피연산자를 반환한다.
- 그렇지 않으면 좌항의 피연산자를 반환한다.
- 변수에 기본값을 설정할 때 유용하다.
```js
var foo = null ?? 'default string';
console.log(foo); // 'default string'
```

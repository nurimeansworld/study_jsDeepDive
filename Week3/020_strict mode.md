### strict mode
---
목록
- 20.1 strict mode란?
- 20.2 strict mode의 적용
- 20.3 전역에 strict mode를 적용하는 것은 피하자
--- 
#### strict mode란?
```js
function foo() {
    x = 10;
}
foo();

console.log(x); // 10 
```
- 함수 내에도, 전역 공간에도 x 변수의 선언이 존재하지 않지만 에러가 발생하지 않습니다.
- 자바스크립트 엔진이 전역 객체에 x 프로퍼티를 동적으로 생성했기 때문입니다.
- 이를 암묵적 전역이라고 합니다.
- 암묵적 전역은 오류를 발생시킬 수 있으므로 변수를 선언할 때는 반드시 var, let, const 키워드를 사용하도록 합니다.


#### strict mode와 유사한 효과를 내는 ESLint 린트도구
- 정적 분석 기능을 통해 소스코드를 실행하기 전에 소스코드를 스캔하여 문법적 오류와 잠재적 오류까지 찾아내 오류의 원인을 리포팅해주는 도구입니다. 
- strict mode가 제한하는 오류와 코딩 컨벤션을 정의해서 강제할 수 있어서 효과적입니다.

#### strict mode의 적용
- ES6에서 도입된 클래스와 모듈은 기본적으로 strict mode가 적용됩니다.
- 전역의 선두 또는 함수 몸체의 선두에 `'use strict';` 를 추가합니다.
- 전역의 선두에 추가하면 스크립트 전체에 적용됩니다.
```js
'use strict'; // 전역의 선두

function foo() {
    x = 10; // ReferenceError: x is not defined
}
foo(); 

console.log(x);
```
함수 몸체의 선두에 추가하면 해당 함수와 중첩 함수에 적용합니다.
```js
function foo() {
    'use strict';  // 함수 몸체 선두 

    x = 10; // ReferenceError: x is not defined
}
foo(); 

console.log(x);
```
코드의 선두에 위치시키지 않으면 strict mode가 제대로 동작하지 않습니다.
```js
function foo() {
    x = 10; // 에러를 발생시키지않는다.

    'use strict';  

}
foo(); 

console.log(x);
```
#### 전역에 strict mode를 적용하는 것은 피하자
- stirct mode는 스크립트 단위로 적용됩니다. 
```html
<!DOCTYPE html>
<html>
<body>
    <script>
        'use strict';
    </script>
    <script>
        x = 1; // 에러가 발생하지 않습니다.
        console.log(x); // 1 
    </script>
    <script>
        'use strict';

        y = 1; // ReferenceError: y is not defined
        console.log(y);
    </script>
</body>
</html>
```
#### 함수 단위로 strict mode를 적용하는 것도 피하자
- 어떤 함수는 적용하고 어떤 함수는 적용하지 않는 것은 바람직하지 않습니다.
- 모든 함수에 일일이 적용하는 것은 번거로운 일 입니다.
- strict mode는 즉시 실행 함수로 감싼 스크립트 단위로 적용하는 것이 바람직합니다.
```js
(function () {
    var let = 10;
    function foo () {
        'use strict';
        
        let = 20; // 에러 
    }
    foo();
}()); 
```

#### strict mode가 발생시키는 에러 
- 암묵적 전역<br>
선언하지 않은 변수를 참조하면 ReferenceError가 발생합니다. 

- 변수, 함수, 매개변수의 삭제<br>
delete 연산자로 변수, 함수, 매개변수를 삭제하면 SyntaxError가 발생합니다. 
```js
(fuction () {
    'use strict';

    var x = 1;
    delete x;  // 변수 삭제 : SyntaxError

    function foo(a) {
        delete a;  // 매개변수 삭제 : SyntaxError
    }
    delete foo; // 함수 삭제 : SyntaxError
})
```
- 매개변수 이름의 중복
```js
(function () {
    'use strict';

function foo(x, x){
return x + x;
}
console.log(foo(1, 2));
}());
// SyntaxError: Duplicate parameter name not allowed in this context
```
- with 문의 사용<br>
with문은 객체의 프로퍼티를 반복할 때 객체 이름을 생략할 수 있지만 성능과 가독성의 문제로 권고하지 않습니다.
```js
(function () {
    'use strict';

    with({ x: 1}) {
        console.log(x);
    }
}());
```
#### strict mode 적용에 의한 변화

## Ajax
- `Ajax(Asynchronous JavaScript and XML)`란 브라우저가 서버에게 **비동기 방식**으로 데이터를 요청하고, 서버가 응답한 데이터를 수신하여 **웹페이지를 동적으로 갱신**하는 프로그래밍 방식을 말한다. 
- `Ajax`가 등장하기 이전의 웹페이지는 화면의 전환이 있을 때 마다 html 태그로 시작해서 html태그로 끝나는 HTML을 매번 서버로부터 전송받아 **웹페이지 전체를 처음부터 다시 렌더링**하는 방식으로 동작했다. 
  - 불필요한 데이터통신, 화면 깜빡임, 다음 처리 블로킹 등의 문제점 발생
- `Ajax`가 등장한 이후 웹페이지는 웹페이지의 **변경에 필요한 데이터만** **비동기 방식**으로 전송받아 **변경할 필요가 없는 부분은 다시 렌더링하지 않게** 되었다. 

### JSON
- `JSON(JavaScript Object Notation)`은 클라이언트와 서버 간의 HTTP 통신을 위한 텍스트 데이터 포맷이다.
- 대부분의 프로그래밍 언어에서 사용할 수 있다.
#### JSON 표기 방식
- 키와 값은 반드시 큰따옴표로 묶어야 한다.
- 값은 자바스크립트의 객체 리터럴 표기법처럼 표기할 수 있다.
```json
{
  "name": "Lee",
  "age": 20,
  "alive": true,
  "hobby": ["traveling", "tennis"]
}
```
#### JSON.stringify
- `JSON.stringify`: 객체를 `JSON` 포맷의 문자열로 변환한다. 
- 클라이언트가 서버로 객체를 전송하려면 객체를 문자열화(직렬화)해야 하는 데 이 때 사용한다.
```js
const obj = {
  name: "Lee",
  age: 20,
  alive: true,
  hobby: ["traveling", "tennis"]
};

// 객체를 JSON 포맷의 문자열로 변환.
const json = JSON.stringify(obj);
console.log(typeof json, json);
// string {"name":"Lee","age":20,"alive":true,"hobby":["traveling","tennis"]}

// 객체를 JSON 포맷의 문자열로 변환하면서 들여쓰기
// JSON.stringify(value, ?replacer, ?space)
const prettyJson = JSON.stringify(obj, null, 2);
console.log(typeof prettyJson, prettyJson);
/*
string {
    "name": "Lee",
    "age": 20,
    "alive": true,
    "hobby": [
        "traveling",
        "tennis"
    ]
}
*/

// replacer 함수. 값의 타입이 Number이면 필터링되어 반환되지 않는다.
function filter(key, value) {
  return typeof value === 'number' ? undefined : value;
}

const strFilteredObject = JSON.stringify(obj, filter, 2);
console.log(typeof strFilteredObject, strFilteredObject);
/*
string {
  "name": "Lee",
  "alive": true,
  "hobby": [
    "traveling",
    "tennis"
  ]
}
*/
```
- **배열**도 `JSON` 포맷의 문자열로 변환할 수 있다.
```js
const todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
];

const json = JSON.stringify(todos, null, 2);
console.log(json);
/*
[
  {
    "id": 1,
    "content": "HTML",
    "completed": false
  },
  {
    "id": 2,
    "content": "CSS",
    "completed": true
  }
]
*/
```
### JSON.parse
- `JSON.parse`: `JSON`포맷의 문자열을 **객체**로 변환.
- 서버로부터 전송된 `JSON` 데이터는 문자열이므로 객체로 사용하려면 객체화(역직렬화)해야 하는 데 이 때 사용한다.
```js
const obj = {
  name: "Lee",
  age: 20,
  alive: true,
  hobby: ["traveling", "tennis"]
};

const json = JSON.stringify(obj);

const parsed = JSON.parse(json);
console.log(typeof parsed, parsed);
// object {name: 'Lee', age: 20, alive: true, hobby: Array(2)}
```
- 배열의 요소가 객체인 경우 배열의 요소까지 객체로 변환한다.
```js
const todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
];

const json = JSON.stringify(todos, null, 2);
const parsed = JSON.parse(json);
console.log(parsed);
/*
0: {id: 1, content: 'HTML', completed: false}
1: {id: 2, content: 'CSS', completed: true}
*/
```

### XMLHttpRequest
#### XMLHttpRequest 객체 생성
- 자바스크립트를 사용하여 HTTP 요청을 전송하려면 브라우저가 제공하는 Web API인 `XMLHttpRequest` 객체를 사용한다. (브라우저 환경에서만 정상 작동)
- `XMLHttpRequest` 객체는 HTTP 요청 전송과 HTTP 응답 수신을 위한 다양한 메서드와 프로퍼티를 제공한다.
```js
// 생성자 함수 사용.
const xhr = new XMLHttpRequest();
```
- 다양한 XMLHttpRequest 객체의 프로퍼티와 메서드는 [MDN공식문서](https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest)를 참고하자..
#### HTTP 요청 전송
```js
const xhr = new XMLHttpRequest();

// 1. open 메서드로 HTTP 요청을 초기화한다.
xhr.open('GET', '/users');

// 2. 필요에 따라 setRequestHeader 메서드로 특정 HTTP 요청의 헤더 값을 설정한다.
xhr.setRequestHeader('content-type', 'application/json');

// 3. send 메서드로 HTTP 요청을 전송한다.
xhr.send();
```
- `XMLHttpRequest.prototype.open`
  - `xhr.open(method, url[, async])`
  - `method`: `GET`, `POST`, `PUT`, `DELETE` 등
  - `url`: http 요청을 전송할 url
  - `async`: 비동기 요청 여부. 기본값은 `true`이다.

- `XMLHttpRequest.prototype.setRequestHeader`
  - 반드시 `open` 메서드를 호출한 이후에 호출해야 한다.
  - `Content-type`은 요청 몸체에 담아 **전송할 데이터**의 MIME 타입을 표현한다. 

  <br>

  MIME타입 | 서브타입
  :--|--
  text | text/plain, text/html, text/css, text/javascript
  application | application/json, application/x-www-form-urlencode
  multipart | multipart/formed-data

  - **서버가 응답할 데이터**의 MIME 타입을 `Accept`로 지정할 수 있다.
  - 만약 `accept` 헤더를 설정하지 않으면 `accept` 헤더가 `*/*`으로 전송된다.

  <br>

  ```js
  xhr.setRequestHeader('accept', 'application/json');
  ```

- `XMLHttpRequest.prototype.send`
  - 서버로 전송하는 데이터는 `GET`, `POST` 요청 메서드에 따라 전송 방식에 차이가 있다.
  - `GET`: 데이터를 URL의 일부분인 **쿼리 문자열**로 전송.
  - `POST`: 데이터를 **요청 몸체(reqeust body)** 에 담아 전송.
  - 전송할 데이터(페이로드)를 인수로 전달할 수 있다. 단, 페이로드가 객체인 경우 반드시 `JSON.stringify`메서드를 통해 **직렬화**한 다음 전달해야 한다.
  - 요청 메서드가 `GET`인 경우 페이로드로 전달한 인수는 무시되고 요청 몸체는 `null`로 설정된다.

  <br>

  ```js
  xhr.send(JSON.stringify({ id: 1, content: 'HTML', completed: false }));
  ```

### HTTP 응답처리
```js
const xhr = new XMLHttpRequest();

xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1');

xhr.send();

// readystatechange 이벤트는 http 요청의 현재 상태를 나타내는
// readyState 프로퍼티가 변경될 때마다 발생한다.
xhr.onreadystatechange = () => {
  // readyState 프로퍼티의 값이 4(XMLHttpRequest.DONE)가 아니면 서버 응답이 완료되지 않은 상태다.
  // 서버 응답이 아직 완료되지 않았으면 아무런 처리를 하지 않는다.
  if(xhr.readyState !== XMLHttpRequest.DONE) return;


  // status 프로퍼티 값이 200이 아니면 에러가 발생한 상태다.
  // 정상적으로 응답된 상태라면 response 프로퍼티에 서버의 응답 결과가 담겨 있다.
  if(xhr.status === 200) {
    console.log(JSON.parse(xhr.response));
    // {userId: 1, id: 1, title: 'delectus aut autem', completed: false}
  } else {
    console.error('Error', xhr.status, xhr.statusText);
  }
};
```
- `readyState` 프로퍼티 값은 [여기](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)를 참조하자.
- `load` 이벤트는 HTTP 요청이 성공적으로 완료된 경우 발생하기 떄문에 `xhr.readyState`가 `XMLHttpRequest.DONE`인지 확인할 필요가 없다.
- `load`로 캐치해 보자.

```js
const xhr = new XMLHttpRequest();

xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1');

xhr.send();

xhr.onload = () => {
    if(xhr.status === 200) {
    console.log(JSON.parse(xhr.response));
    // {userId: 1, id: 1, title: 'delectus aut autem', completed: false}
  } else {
    console.error('Error', xhr.status, xhr.statusText);
  }
};
```

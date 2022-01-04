//es8에서는 제너레이터보다 간단하고 가독성 좋게 비동기처리를 동기 처리처럼 동작하도록 구현할 수 있는 async/await이 도입됨.

// 46.6.1.async : async 함수는 async 키워드를 사용해 정의하며 언제나 프로미스를 반환한다.
// async & await : 깔끔하게 promise를 사용하는 방법
// 무조건 async & await >> promise가 아니라 경우에 따라 더 좋은 게 있음

//일반 promise
function fetchUser() {
  return new Promise((resolve, reject) => {
    resolve("ellie");
  });
}
const user = fetchUser();
user.then(console.log);

//async 사용
async function fetchUser() {
  return "ellie";
}

const user = fetchUser();
user.then(console.log);

//46.6.2 await 키워드 : await 키워드는 settled 상태(비동기 처리가 수행된 상태)가 될 때까지 대기하다가 settled 상태가 되면 프로미스가 resolve한 처리 결과를 반환.

// 정해진 ms가 지나면 resolve를 호출하는 promise를 리턴하는 함수
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//delay가 끝날 때까지 기다렸다가 사과를 리턴해줌
async function getApple() {
  await delay(1000);
  return "🍎";
}

//동기적인 코드를 쓰는 것처럼 깔끔
async function getBanana() {
  await delay(1000);
  return "🍌";
}

//promise로 썼다면 체이닝이 이어지는 느낌
function getBanana() {
  return delay(1000).then(() => "🍌");
}

// 예를 들어 사과를 받고, 사과가 받아오지면 바나나를 받고, 바나나가 받아와지면 사과랑 바나나를 묶어서 리턴 //  🍎 + 🍌
// !! 프로미스 체이닝 ... 콜백지옥 연상
function pickFruits() {
  return getApple().then((apple) => {
    return getBanana().then((banana) => `${apple}+${banana}`);
  });
}

// async 사용
async function pickFruits() {
  const apple = await getApple(); // 1초 소요
  const banana = await getBanana(); // 1초 소요
  return `${apple} + ${banana}`; // 2초 소요
}

pickFruits().then(console.log); // 🍎 + 🍌

// 46.6.3 에러처리 : async/await에서 에러 처리는 try..catch문을 사용할 수 있다.
// 프로미스를 반환하는 비동기 함수는 명시적으로 호출할 수 있기 때문에 호출자가 명확하다.

async function getBanana() {
  await delay(1000);
  throw "에러 발생";
  return "🍌";
}

//기존의 에러 핸들링처럼 try..catch..를 사용함
async function pickFruits() {
  try {
    const apple = await getApple();
    const banana = await getBanana();
  } catch (err) {
    console.log(err);
  }
  return `${apple} + ${banana}`;
}

//4. await 병렬 처리 (관련 예제 46-19)

//비효율적
// 서로 연관이 없이 개별적으로 수행되는 비동기 처리이기 때문에
// 앞선 비동기 처리가 완료될 때가지 대기해서 순차적으로 처리할 필요가 없음

async function pickFruits() {
  const apple = await getApple(); // 1초 소요
  const banana = await getBanana(); // 1초 소요
  return `${apple} + ${banana}`; //총 2초 소요
}
pickFruits().then(console.log); // 🍎 + 🍌

//관련 예제 (46-20)
async function bar(n) {
  const 과일 = await new Promise((resolve) =>
    setTimeout(() => resolve(n), 3000)
  );
  const 과일잼 = await new Promise((resolve) =>
    setTimeout(() => resolve(과일 + 잼), 3000)
  );
  const 과일잼토스트 = await new Promise((resolve) =>
    setTimeout(() => resolve(과일잼 + 토스트), 3000)
  );

  return 과일잼토스트;
}

bar(사과);

// 사과를 따서 사과잼을 만들어서 사과잼 토스트 먹을 게 아니면
// 서로 연관 없이 개별적으로 수행해도되면 병렬 처리.

//5. 유용한 promise api 사용
//5-1. Promise.all
// promise의 배열을 전달하면, 모든 promise들이 병렬적으로 실행
function pickAllFruits() {
  return Promise.all([getApple(), getBanana()]).then((fruitsArray) =>
    fruitsArray.join("+")
  );
}
pickFruits().then(console.log); // "🍎 + 🍌"

//5-1. Promise.race
//어떤 것이든 상관없고 먼저 따온 첫 번째 과일을 받아올 때
//예를 들어 사과는 2초 걸리고 바나나는 1초 걸리는 경우
function pickOnlyOne() {
  return Promise.race([getApple(), getBanana()]);
}

pickOnlyOne().then(console.log); //🍌 1초만에 출력

//async, await은 promise를 간편하게 쓸 수 있음
//promise는 all이나 race처럼 유용한 api가 있다.

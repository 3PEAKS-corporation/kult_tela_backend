const { app, env } = require('../config/')
const { db } = require('../services/')

const startServer = () => {
  const App = app()
  App.create(env)
  App.start()
  return App.app
}

const server = startServer()
const request = require('supertest')

describe('SignUp tests', () => {
  console.log = () => {}
  it('SignUp with plan 0', signUpTest(0), 20000)
  it('SignUp with plan 1', signUpTest(1), 20000)
  it('SignUp with plan 1', signUpTest(2), 20000)
  it('SignUp with plan 1', signUpTest(3), 20000)
})

function signUpTest(planId = 1) {
  return async function(done) {
    let query = `SELECT email FROM users ORDER BY ID DESC LIMIT 1`
    let values
    const email = 't.' + (await db.query(query)).rows[0].email
    console.log('new email: ' + email)
    expect(typeof email).toBe('string')

    // choosing plan and proceeding
    let res = await request(server)
      .put('/auth/signup')
      .send({
        email: email,
        plan_id: planId
      })
      .expect(200)
      .expect('Content-Type', /json/)
    expect(res.body.data.codeUsed).not.toBe(true)

    // simulating payment
    if (planId !== 1) {
      query = `UPDATE payments SET status='succeeded' WHERE user_id=(SELECT id FROM users WHERE email=$1) AND type='PLAN_BUY'`
      values = [email]
      await db.query(query, values)
    }

    // simulating checking email
    query = `SELECT hash FROM hashes WHERE type='PLAN_BUY' AND user_id=(SELECT id FROM users WHERE email=$1)`
    values = [email]
    let hash = (await db.query(query, values)).rows[0].hash
    expect(typeof hash).toBe('string')

    // checking if fill allowed
    res = await request(server)
      .post('/auth/signup')
      .send({ hash })
      .expect(200)
      .expect('Content-Type', /json/)

    const password = '123456'
    res = await request(server)
      .post('/auth/signup/fill')
      .attach('avatar_src', './tests/test_avatar.jpg')
      .field('hash', hash)
      .field('first_name', 'testname')
      .field('last_name', 'tlastname')
      .field('patronymic', 'tpatronymic')
      .field('weight_start', 120)
      .field('password', password)
      .field('age', 40)
      .field('height', 180)
      .expect(200)
      .expect('Content-Type', /json/)

    // checking login
    res = await request(server)
      .post('/auth')
      .send({ email, password })
      .expect(200)
      .expect('Content-Type', /json/)

    expect(res.body.data.token).not.toBeNull()
    expect(typeof res.body.data.user.id).toBe('number')
    done()
  }
}

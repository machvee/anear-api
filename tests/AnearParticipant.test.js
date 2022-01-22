const AnearParticipant = require('../lib/models/AnearParticipant')

const { AnearParticipantFixture1: player1 } =  require('./fixtures')

class TestParticipant extends AnearParticipant {
  initContext() {
    return {score: 97, responses: ['A', 'C', 'D', 'A']}
  }
}

afterAll(async () => await TestParticipant.close())

test('constructor', () =>  {
  const t = new TestParticipant(player1)
  expect(t.id).toBe(player1.data.id)
  expect(t.relationships.user.data.type).toBe("users")
  expect(t.context.score).toBe(97)
})

test('participant can be repeatedly rehydrated and updated', async () => {
  try {
    const participant = new TestParticipant(player1)
    await participant.persist()

    let p = await TestParticipant.getFromStorage(player1.data.id)

    expect(p.context.responses).toStrictEqual(['A', 'C', 'D', 'A'])
    p.context.responses.push('B')

    await p.update()

    p = await TestParticipant.getFromStorage(player1.data.id)
    expect(p.context.responses[4]).toBe('B')

    await p.remove()

  } catch(error) {
    console.error(error)
  }
})

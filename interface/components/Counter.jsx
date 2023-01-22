import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"

const Proposals = () => {
  /*
   * This how you use canisters throughout your app.
   */
  const [dao] = useCanister("dao")
  const [proposals, setProposals] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [voted, setVoted] = useState(false)

  const refreshCounter = async () => {
    const getProposals = await dao.list_all_proposals()

    const objProposal = getProposals.map((proposals) => {
      // return { ...proposals[1], id: Number(proposals[1].id) }
      return proposals[1]
    })
    console.log(getProposals, 'get all proposals')
    setProposals(objProposal)
  }

  const addProposal = async () => {
    await dao.create_proposal(newMessage)
    await refreshCounter()
    console.log('add proposal')
  }

  const handleChange = (event) => {
    setNewMessage(event.target.value)
  }

  const deleteProposal = async (id) => {
    await dao.delete_proposal(id)
    await refreshCounter()
  }

  const voteProposal = async (id) => {
    await dao.vote(id, true)
    await refreshCounter()
  }

  useEffect(() => {
    if (!dao) {
      return
    }
    refreshCounter()
    console.log(proposals, "proposals", dao)
  }, [dao])

  useEffect(() => {
    console.log(proposals, "useEffefr")
  }, [proposals])

  return (
    <div className="example">
      <label htmlFor="proposal">Proposal</label>
      <input
        type="text"
        id="proposal"
        name="proposal"
        onChange={handleChange}
        value={newMessage}
      />
      <button className="connect-button" onClick={addProposal}>
        AddProposal
      </button>

      <ul>
        {proposals?.map((proposal) => {
          return (
            <li key={proposal.motion}>
              {proposal.motion}{" "}
              <button
                className="delete-btn"
                onClick={() => deleteProposal(proposal.id)}
              >
                Delete
              </button>
              <p>
                VOTES:{" "}
                <span>{Number(proposal.upVotes)}</span>
              </p>
              <button
                className="demo-button"
                onClick={() => voteProposal(proposal.id)}
              >
                VOTE
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { Proposals }

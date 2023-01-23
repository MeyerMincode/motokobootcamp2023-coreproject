import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"

const Proposals = () => {
  /*
   * This how you use canisters throughout your app.
   */
  const [dao] = useCanister("dao")
  const [proposals, setProposals] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [deleteState, setDeleteState] = useState(null)
  const [voteResState, setVoteResState] = useState(null)
  const [addProposalState, setAddProposalState] = useState(null)

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
    const addProposalRes = await dao.create_proposal(newMessage)
    setAddProposalState(addProposalRes)

    console.log(addProposalState,'add proposal')
    await refreshCounter()
  }

  const handleChange = (event) => {
    setNewMessage(event.target.value)
  }

  const deleteProposal = async (id) => {
    
    const deleteRes = await dao.delete_proposal(id)
    console.log(deleteRes, 'delete');
    setDeleteState(deleteRes)

    await refreshCounter()
  }

  const voteProposal = async (id, voteType) => {
    const voteRes = await dao.vote(id, voteType)
    console.log(voteRes, id, voteType, 'vote')
    setVoteResState(voteRes)

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
      <div className="form__group field">
      <input
        type="text"
        id="proposal"
        name="proposal"
        className="form__field"
        placeholder="Proposal Title"
        onChange={handleChange}
        value={newMessage}
      />
            <label className="form__label" htmlFor="proposal">Proposal</label>

      </div>
      
       <p className="danger-text">
              {
                addProposalState && addProposalState.error
              }
        </p>
        <p className="succes-text">
              {
                addProposalState && addProposalState.ok
              }
        </p>
      <button className="connect-button" onClick={addProposal}>
        AddProposal
      </button>

      <ul>
        {proposals?.map((proposal) => {
          return (
            <li className="card-proposal" key={proposal.motion}>
              <h3>{proposal.motion}</h3>{" "}
              {Number(proposal.upVotes - proposal.downVotes)> 100 && <span className="passed">V</span>}

              <button
                className="delete-btn"
                onClick={() => deleteProposal(proposal.id)}
              >
                X
              </button>
              <p>
                VOTES:{" "}
                <span>{Number(proposal.upVotes)}</span>
              </p>
              <div className="cta">
              <button
                className="demo-button"
                onClick={() => voteProposal(proposal.id, true)}
              >
                YES
              </button>
              <button
                className="demo-button no "
                onClick={() => voteProposal(proposal.id, false)}
              >
                NO!!
              </button>
              </div>

              <p className="danger-text">
              {
                deleteState && deleteState.error
              }
              </p>
                  {
                    voteResState && voteResState.ok && <p className="succes-text">
                                {
                                  voteResState.ok
                                }
                    </p>      
                  }
                  {
                    voteResState && voteResState.error && <p className="danger-text">
                                {
                                  voteResState.error
                                }
                    </p>      
                  }
              
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { Proposals }

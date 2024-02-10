import React, {useState} from 'react'
import {v1 as uuid} from 'uuid'
import styled from 'styled-components'

const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60vh;
    flex-wrap: wrap;
`

const FormContainer = styled.div`
    background-color: #343a40!important;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    max-width: 400px;
    border-radius: 6px;
`

const FormItemContainer = styled.div`
    width: 100%;
    text-align: center;
`

const StyledButton = styled.button`
    background-color: #343a40;
    color: white !important;
    border-radius: 6px;
    margin: 48px 0;
    font-size: 1.75rem;
`

const OrText = styled.p`
    font-size: 1.5rem;
    color: white;
    margin 32px 0;
`

const FormInput = styled.input`
    margin-top: 32px;
    width: 300px;
    border-radius: 6px;
`

const CreateRoom = props => {
    const [roomId, setRoomId] = useState('')

    function create() {
        const id = uuid()
        props.history.push(`/room/${id}`)
    }

    const joinRoom = () => {
        if (roomId.length > 30) {
            window.location.assign(window.location.origin + '/' + roomId)
        } else {
            alert('Invalid room ID!')
        }
    }

    return (
        <div className='container-fluid centered'>
            <nav className='navbar navbar-expand navbar-dark bg-dark sticky-top'>
                <a href={window.location.origin}>
                    <span className='navbar-brand'>Vroom</span>
                </a>
            </nav>

            <PageContainer className='join-room-page-container'>
                <FormContainer>
                    <FormItemContainer>
                        <StyledButton onClick={create}>Create new room</StyledButton>
                    </FormItemContainer>

                    <OrText>- OR -</OrText>

                    <FormItemContainer>
                        <FormInput onChange={e => setRoomId(e.target.value)}></FormInput>
                    </FormItemContainer>

                    <FormItemContainer>
                        <StyledButton onClick={joinRoom}>Join room</StyledButton>
                    </FormItemContainer>
                </FormContainer>
            </PageContainer>
        </div>
    )
}

export default CreateRoom

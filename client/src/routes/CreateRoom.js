import React from "react";
import { v1 as uuid } from "uuid";
import styled from 'styled-components'

const StyledButton = styled.button`
    background-color: #343a40;
    color: white !important
`

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <StyledButton onClick={create}>Create room</StyledButton>
    );
};

export default CreateRoom;

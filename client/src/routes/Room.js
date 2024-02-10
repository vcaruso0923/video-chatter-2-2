import React, {useEffect, useRef, useState} from 'react'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    width: auto;
    margin: 0 auto;
    flex-wrap: wrap;
    padding: 0;
`

const StyledVideo = styled.video`
    height: 200px;
    width: 33%;
    display: flex;
    margin-bottom: 15px;
`

const StyledButton = styled.button`
    background-color: #343a40;
    color: white !important
`

const Video = props => {
    const ref = useRef()

    useEffect(() => {
        props.peer.on('stream', stream => {
            ref.current.srcObject = stream
        })
    }, [])

    return <StyledVideo playsInline autoPlay ref={ref} />
}

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
}

const Room = props => {
    const [peers, setPeers] = useState([])
    const socketRef = useRef()
    const userVideo = useRef()
    const peersRef = useRef([])
    const roomID = props.match.params.roomID

    useEffect(() => {
        socketRef.current = io.connect('/')
        navigator.mediaDevices
            .getUserMedia({video: videoConstraints, audio: true})
            .then(stream => {
                userVideo.current.srcObject = stream
                socketRef.current.emit('join room', roomID)
                socketRef.current.on('all users', users => {
                    const peers = []
                    users.forEach(userID => {
                        const peer = createPeer(userID, socketRef.current.id, stream)
                        peersRef.current.push({
                            peerID: userID,
                            peer
                        })
                        peers.push(peer)
                    })
                    setPeers(peers)
                })

                socketRef.current.on('user joined', payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream)
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer
                    })

                    setPeers(users => [...users, peer])
                })

                socketRef.current.on('receiving returned signal', payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id)
                    item.peer.signal(payload.signal)
                })
            })
            .catch(e => {
                window.alert(e)
            })
    }, [])

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        })

        peer.on('signal', signal => {
            socketRef.current.emit('sending signal', {userToSignal, callerID, signal})
        })

        return peer
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        })

        peer.on('signal', signal => {
            socketRef.current.emit('returning signal', {signal, callerID})
        })

        peer.signal(incomingSignal)

        return peer
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        window.alert('Copied meeting link to clipboard!')
    }

    return (
        <div className='container-fluid centered'>
            <nav className='navbar navbar-expand navbar-dark bg-dark sticky-top'>
                <a href='https://video-chatter-36bb730f7df7.herokuapp.com/dashboard'>
                    <span className='navbar-brand'>Vroom</span>
                </a>
                <StyledButton onClick={copyToClipboard} className='navbar-text room-id-button'>Room ID: {window.location.href.split('/').pop()}</StyledButton>
                <div className='justify-content-end navbar-collapse collapse'>
                    <span className='navbar-text'>
                        <span>
                            <a href='https://video-chatter-36bb730f7df7.herokuapp.com/dashboard'>Leave Room</a>
                        </span>
                    </span>
                </div>
            </nav>

            <Container>
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                {peers.map((peer, index) => {
                    return <Video key={index} peer={peer} />
                })}
            </Container>
        </div>
    )
}

export default Room

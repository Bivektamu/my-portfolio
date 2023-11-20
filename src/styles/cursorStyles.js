import styled from 'styled-components'

export const Cursor = styled.div`
    /* background: red; */
    width: 20px;
    height:20px;
    border-radius: 100%;
    background:none;
    border: 2px solid #141313;
    position: fixed;
    pointer-events: none;
    z-index: 99;
    transform: translate(-50%, -50%);
    /* transform: scale(2) */
    transition: all 0.2s linear;
    transition-property: width, height, border;
    will-change:  width, height, border;

    @media screen and (max-width: 1000px) {
        display:none;

    }
    &.hovered {
        width:40px;
        height:40px;
        border-width: 4px;
    }
    &.border__red {
        border-color: red;
    }
`
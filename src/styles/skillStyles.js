import styled from 'styled-components'


export const SkillSection = styled.section`
    .flex__wrap {
        max-width: 800px
    }
    .single__brand {
        border: 1px solid ${props => props.theme.borderColor};
        /* border: 1px solid #fff; */
        /* background: #fff; */
        text-align: center;
        padding: 15px 0;
        margin: 20px 0;
        width: 180px;
        height: 100px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.4s ease;
        .skill__icon{
            width: 60%;
        }

        &:hover {
            box-shadow: ${props => props.theme.boxShadow};
            transform: scale(1.1);
        }


    }

    @media screen and (max-width: 1100px) {
        .single__brand:hover {
            transform: scale(1.05)
        }
    }

    @media screen and (max-width: 760px) {
        .single__brand {
            margin-left:auto;
            margin-right:auto;
        }
    }

`

export const ExperienceWrapper = styled.div`
    padding: 40px;
    background: #e029290a;
    width: 350px;
    max-width: 100%;
    display: block;
    margin-left:10vw;
    @media screen and (max-width: 1000px) {
        margin-left:0;
    }

    @media screen and (max-width: 760px) {
        padding:40px 20px;
    }
    /* margin-left: auto; */
    .years__area {
        margin-bottom: 100px;
        position: relative;

        h1 {
            color: #854fee;
            sup {
                top:-0.5em
            }

        }

        h2 {
            font-weight: normal;
            text-transform: capitalize;
            span {
                display: block;
            }
        }
    }

    .call__area {
        width: 205px;
        svg {
            width: 48px;
            height: auto;
            margin: 0 16px;
            path {
                fill: #212529;
            }
        }
        h4 {
            font-weight: 500;
        }
        .call__now a {
            font-weight: 500;
            color:#007bff;
        }
    }

`
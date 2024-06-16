import styled from 'styled-components'


export const ProjectSection = styled.section`
    flex-direction: column;

    .grid__4 {
        margin-bottom: 40px;
    }

`

export const ImageWrapper = styled.div`
    overflow: hidden;
    position: relative;
    box-shadow: -7px 13px 16px -1px rgb(0 0 0 / 66%);
        .img {
            transition: all 0.3s ease;
            width:100%;
            aspect-ratio:3/2;
            object-fit:cover;
            display:block;
           
        }
        .link-wrapper {
            position: absolute;
            top: 0;
            bottom: 0;
            /* height: 20px; */
            margin: auto;
            left: 0;
            right: 0;
            text-align: center;
            z-index: 2;
            transform: translateY(20px);
            display: block;
            opacity: 0;
            transition: all 0.3s ease;
            display:flex;
            justify-content:space-evenly;
            align-items: center;

        }
        &:after {
                width: 100px;
                height: 100px;
                background: rgba(119, 119, 119, 0.5);
                border-radius: 100%;
                content: '';
                position: absolute;
                top: -50px;
                left: -50px;
                /* opacity: 0; */
                transform: scale(0);
                transition: all 0.3s ease;
            }
        &:hover{
            &:after {
                opacity: 1;
                transform: scale(16);
            }
            .img {
                transform:scale(1.1);
            }

            .link-wrapper {
                opacity:1;
                transform: translateY(0);
            }

        }
            
        
`
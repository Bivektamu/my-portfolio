import styled from "styled-components";

export const HeaderWrapper = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  background: ${(props) => props.theme.background};
  z-index: 9;
  transition: top 0.4s ease;
  transition-delay: 2s;
  &.hide {
    top: -100%;
  }

  &.fixed {
    box-shadow: ${(props) => props.theme.boxShadow};
  }

  & > div {
    position: relative;
  }

  #nav__toggle {
    display: none;
  }
  .nav-link {
    cursor: pointer;
  }
  &.activeNav #nav__toggle {
    span {
      background: none;
      &:before,
      &:after {
        transform: rotate(45deg);
        top: 0;
      }
      &:after {
        transform: rotate(-45deg);
      }
    }
  }

  &.activeNav nav {
    opacity: 1;
    visibility: visible;

    &:after {
      transform: scale(1);
    }
  }

  @media screen and (max-width: 760px) {
    // padding: 15px 0;
    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      #nav__toggle {
        display: block;
        width: 25px;
        height: 25px;
        position: relative;
        outline: none;
        background: transparent;
        border: none;
        z-index: 9;
        &:after {
          background: #854fee;
          width: 10px;
          height: 10px;
          content: "";
          position: fixed;
          border-radius: 100%;
          top: -5px;
          right: 5px;
          transform: scale(11);
          z-index: -1;
        }

        span {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 100%;
          height: 2px;
          background: #fff;
          &:before,
          &:after {
            content: "";
            position: absolute;
            left: 0;
            top: -6px;
            margin: auto;
            width: 100%;
            height: 2px;
            transition: all 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
            background: #fff;
          }
          &:after {
            top: 6px;
          }
        }
      }
    }
  }
`;

export const Logo = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  p {
    font-size: 1.8rem;
    display: inline-block;
    font-weight: 800;
    color: ${(props) => props.theme.color};
  }
  span {
    height: 1rem;
    width: 1rem;
    background: #4458dc;
    margin: 0 4px;
    border-radius: 100%;
    display: inline-block;
    position: relative;
    bottom: 2px;
    cursor: pointer;
  }

  @media screen and (max-width: 760px) {
    position: static;
    transform: none;
  }
`;

export const NavMenu = styled.nav`
  display: block;
  width: 600px;
  margin: 0;
  margin-left: auto;

  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4rem 0;
    margin: 0;

    li {
      list-style: none;

      a {
        text-transform: uppercase;
        line-height: 1;
        color: ${(props) => props.theme.color};
        font-size: 1.5rem;
        font-weight: 500;
        &:hover {
          color: #854fee;
        }

        &.tel {
          svg {
            width: 20px;
            height: auto;
          }
        }
      }

      &.active a {
        color: #854fee;
      }
    }
  }

  @media screen and (max-width: 1100px) {
    width: 550px;
  }

  @media screen and (max-width: 760px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* opacity:0; */
    visibility: hidden;
    /* transition: all 0.6s cubic-bezier(0.075, 0.82, 0.165, 1); */

    &:after {
      content: "";
      position: fixed;
      right: -120vh;
      top: -120vh;
      z-index: -1;
      margin: auto;
      width: 240vh;
      height: 240vh;
      border-radius: 100%;
      background: #854fee;
      transition: all 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
      transform: scale(0);
    }
    ul {
      width: 100%;
      flex-direction: column;
      flex-wrap: wrap;
      li {
        display: block;
        width: 100%;
        text-align: center;
        margin: 10px 0;
        a {
          font-size: 3rem;
          color: #24292f;
        }

        &.active a {
          color: #fff;
        }
      }
    }
  }
`;

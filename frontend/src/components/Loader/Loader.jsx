import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loading-wave">
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  position: fixed;
  top: 0;
  left: 0;
  backdrop-filter: blur(8px); /* Blurs the background */
  background: rgba(255, 255, 255, 0.3); /* Light transparent overlay */

  .loading-wave {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 10; /* Ensures it's above the blurred background */
  }

  .loading-bar {
    width: 20px;
    height: 10px;
    margin: 0 5px;
    background-color: #3498db;
    border-radius: 5px;
    animation: loading-wave-animation 1s ease-in-out infinite;
  }

  .loading-bar:nth-child(2) {
    animation-delay: 0.1s;
  }

  .loading-bar:nth-child(3) {
    animation-delay: 0.2s;
  }

  .loading-bar:nth-child(4) {
    animation-delay: 0.3s;
  }

  @keyframes loading-wave-animation {
    0% {
      height: 10px;
    }

    50% {
      height: 50px;
    }

    100% {
      height: 10px;
    }
  }
`;

export default Loader;

import styled from 'styled-components';
import { fadeIn, slideUp } from '../../styles/animations';

interface WidgetContainerProps {
  position: string;
}

const positionStyles = {
  'bottom-right': { bottom: '20px', right: '20px' },
  'bottom-left': { bottom: '20px', left: '20px' },
  'top-right': { top: '20px', right: '20px' },
  'top-left': { top: '20px', left: '20px' },
};

export const WidgetContainer = styled.div<WidgetContainerProps>`
  position: fixed;
  ${props => positionStyles[props.position as keyof typeof positionStyles]}
  z-index: 9999;
  font-family: ${props => props.theme.fontFamily};
`;

export const ChatContainer = styled.div`
  width: 380px;
  height: 600px;
  background-color: ${props => props.theme.backgroundColor};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out, ${slideUp} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`; 
import ReactHtmlParser from 'html-react-parser';
import styled from 'styled-components';

const previewText = (props) => {

  return (
    <Body>
      <b>Как будет выглядеть описание:</b><br/> <br/>
      {ReactHtmlParser(props?.description)}
    </Body>
  )
}

export default previewText;

const Body = styled.div`
  max-width: 1000px;
  width: 100%;
`;

import { useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { rootContext } from '../../App'
function About() {
  const history = useHistory();
  const globalValue: any = useContext(rootContext)
  console.log(globalValue);

  useEffect(() => {
    console.log('Render About Page!');
  }, [])
  return (
    <div>
      This is about page!
      <button onClick={() => history.push('/')}>go home</button>
      <div>
        { globalValue?.musicJson?.msg }
      </div>
    </div>
  );
}

About.getInitialProps = async () => {
  const musicJson = await (await fetch('https://www.sojson.com/api/qqmusic/8446666')).json()
  return {
    musicJson
  }
}

export default About;

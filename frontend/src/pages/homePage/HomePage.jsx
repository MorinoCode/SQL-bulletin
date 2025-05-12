import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import backgroundPic from '../../assets/pics/homepageBG.gif'
import "./HomePage.css";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="home">
        <div className="home_left">
            <h2>Välkommen till MessageHub</h2>
        <p>Skicka och dela meddelanden enkelt i olika kanaler.</p>
        </div>
        <div className="home_right">
            <img src={backgroundPic} alt="sending text" />
        </div>
      </main>
      <Footer />
    </>
  );
}

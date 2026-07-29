import { HeroStage } from './components/HeroStage';
import { SpecPlates } from './components/SpecPlates';
import { FeatureStrip } from './components/FeatureStrip';
import { ClosingCTA } from './components/ClosingCTA';

function App() {
  return (
    <>
      <div className="studio-scrim" />
      <div className="grain-overlay" />
      <main className="relative bg-black">
        <HeroStage />
        <SpecPlates />
        <FeatureStrip />
        <ClosingCTA />
      </main>
    </>
  );
}

export default App;

import NewHero from "../NewHero/NewHero";


interface HeroSectionProps {
  resetFormTrigger?: number;
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
}

const HeroSection = ({ resetFormTrigger, zipCode, onZipCodeChange }: HeroSectionProps) => {
  return (
    <>
      <NewHero
        resetFormTrigger={resetFormTrigger}
        zipCode={zipCode}
        onZipCodeChange={onZipCodeChange}
      />
    </>
  );
};

export default HeroSection;

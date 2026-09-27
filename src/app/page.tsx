import { ExperienceProvider } from "@/components/providers/ExperienceProvider";
import { EasterEggProvider } from "@/components/providers/EasterEggProvider";
import { OpeningSequence } from "@/components/opening/OpeningSequence";
import { ChannelHeader } from "@/components/ChannelHeader";
import { ParticleField } from "@/components/ui/ParticleField";
import { Watermark } from "@/components/Watermark";
import { HeroScene } from "@/components/scenes/HeroScene";
import { IncidentReportScene } from "@/components/scenes/IncidentReportScene";
import { QrPanicScene } from "@/components/scenes/QrPanicScene";
import { AtletSimulatorScene } from "@/components/scenes/AtletSimulatorScene";
import { HallOfRespectScene } from "@/components/scenes/HallOfRespectScene";
import { EndingScene } from "@/components/scenes/EndingScene";

export default function Home() {
  return (
    <ExperienceProvider>
      <EasterEggProvider>
        <OpeningSequence />
        <ParticleField />
        <ChannelHeader />
        <main className="relative z-10">
          <HeroScene />
          <IncidentReportScene />
          <QrPanicScene />
          <AtletSimulatorScene />
          <HallOfRespectScene />
          <EndingScene />
        </main>
        <Watermark />
      </EasterEggProvider>
    </ExperienceProvider>
  );
}

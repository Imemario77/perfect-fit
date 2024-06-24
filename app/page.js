import Image from "next/image";

export default function Home() {
  return (
    <div>
      Home
      <div className="bg-primary">color 1 </div>
      <div className="bg-sec-1">color 2</div>
      <div className="bg-sec-2">color 3</div>
      <div className="bg-bg">color 4</div>
      <div className="bg-text">color 5</div>
      <div className="bg-hint">color 6</div>
    </div>
  );
}

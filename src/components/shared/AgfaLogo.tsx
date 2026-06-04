import agfaLogoSrc from "/AGFA logo.png"

type AgfaLogoProps = {
  className?: string
  size?: number
}

const AgfaLogo = ({ className = "", size = 88 }: AgfaLogoProps) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src={agfaLogoSrc}
        alt="AGFA — Gestion financière"
        width={size}
        height={size}
        className="object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  )
}

export default AgfaLogo

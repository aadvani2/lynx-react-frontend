import "./StatsSection.css";

interface StatItemProps {
  end: number;
  suffix?: string;
  label: string;
  showCommas?: boolean;
}

function StatItem({ end, suffix = "", label, showCommas = true }: StatItemProps) {
  const formatNumber = (num: number) => {
    // Check if suffix contains 'M' for millions
    if (suffix.includes('M')) {
      // Format as decimal with M (e.g., 1M, 1.5M)
      const millions = num / 1000000;
      return millions >= 1 ? Math.floor(millions).toString() : '1';
    }
    
    if (showCommas) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <div 
      className={`stats__item text-center`}
    >
      <div className="stats__number fw-bold">
        {formatNumber(end)}
        {suffix}
      </div>
      <div className="stats__label">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="stats py-5">
      <div className="container-fluid py-md-3 py-lg-4">
        <div className="row justify-content-center align-items-center g-3 g-md-4 g-lg-5">
          <div className="col-12 col-md-4 col-lg-4">
            <StatItem end={14302} label="Vetted professionals" />
          </div>
          <div className="col-12 col-md-4 col-lg-4">
            <StatItem end={400} suffix="+" label="Services categories" />
          </div>
          <div className="col-12 col-md-4 col-lg-4">
            <StatItem end={1000000} suffix="M+" label="Services completed" showCommas={false} />
          </div>
        </div>
      </div>
    </section>
  );
}


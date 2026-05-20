import React from 'react'

export default function HireMe(){
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-heading font-semibold text-goldlight">Hire Me</h2>
      <div className="mt-4 card border border-slate hover:border-primary transition">
        <div className="flex flex-col gap-4 p-4">
          <iframe
            title="rate-card"
            src="/data/rate-card/RateCard.pdf"
            className="w-full h-[650px] bg-black/10 rounded"
          />
          <div className="flex justify-start">
            <a
              href="/data/rate-card/RateCard.pdf"
              download
              className="px-3 py-2 border border-accent text-accent rounded-md inline-flex items-center gap-2 justify-center hover:border-primary hover:text-primary transition text-sm"
            >
              <i className="fas fa-download"></i> Download Rate Card
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

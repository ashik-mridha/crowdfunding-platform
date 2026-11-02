"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Accordion, buttonVariants } from "@heroui/react";
import { ArrowRight, Quote } from "lucide-react";
import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CountUp } from "@/components/home/CountUp";
import { Reveal, SectionHeading } from "@/components/home/Reveal";
import { useFetch } from "@/hooks/useFetch";
import { CATEGORY_CARDS, FAQS, STEPS, TESTIMONIALS } from "@/lib/homeContent";
import "swiper/css";
import "swiper/css/pagination";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="how-heading"
          eyebrow="Simple by design"
          title="How Fundora works"
          text="From first idea to money in your account in four clear steps."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl border border-divider bg-background p-6"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-accent font-heading text-lg font-extrabold text-accent-foreground">
                {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/70">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Categories() {
  return (
    <section
      id="categories"
      aria-labelledby="cat-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6"
    >
      <SectionHeading
        id="cat-heading"
        eyebrow="Find your cause"
        title="Explore by category"
        text="Jump straight to the kind of project you want to support."
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_CARDS.map((c, i) => (
          <motion.li
            key={c.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          >
            <Link
              href={`/campaigns?category=${c.name}`}
              className="group relative flex h-48 items-end overflow-hidden rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent"
                aria-hidden="true"
              />
              <span className="relative flex w-full items-end justify-between p-5 text-white">
                <span>
                  <span className="block font-heading text-xl font-extrabold">{c.name}</span>
                  <span className="block text-sm text-white/80">{c.blurb}</span>
                </span>
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function Impact() {
  const { data, loading } = useFetch("/stats/public");
  const items = [
    { label: "Live campaigns", value: data?.totalCampaigns },
    { label: "Credits raised", value: data?.totalRaised },
    { label: "Supporters on board", value: data?.totalSupporters },
  ];
  return (
    <section aria-labelledby="impact-heading" className="bg-navy py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Platform impact</p>
          <h2 id="impact-heading" className="text-3xl font-extrabold sm:text-4xl">
            Impact in numbers
          </h2>
        </Reveal>
        <dl className="grid gap-6 text-center sm:grid-cols-3">
          {items.map((it, i) => (
            <Reveal
              key={it.label}
              delay={i * 0.1}
              className="flex flex-col-reverse rounded-3xl bg-white/5 p-8"
            >
              <dt className="mt-2 text-white/80">{it.label}</dt>
              <dd className="font-heading text-5xl font-extrabold text-accent">
                {it.value === undefined ? loading ? "..." : "-" : <CountUp value={it.value} />}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="voices-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="voices-heading"
        eyebrow="Kind words"
        title="What our community says"
        text="Supporters and creators on how Fundora fits into their work."
      />
      <Swiper
        modules={[Pagination, A11y]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
        pagination={{ clickable: true }}
        a11y={{ paginationBulletMessage: "Go to testimonial {{index}}" }}
        className="testimonial-swiper !pb-12"
      >
        {TESTIMONIALS.map((t) => (
          <SwiperSlide key={t.name} className="!h-auto">
            <figure className="flex h-full flex-col gap-4 rounded-3xl border border-divider bg-surface p-6">
              <Quote className="size-7 text-accent-ink" aria-hidden="true" />
              <blockquote className="flex-1 leading-relaxed text-foreground/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.photo}
                  alt={`Portrait of ${t.name}`}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="size-12 rounded-full object-cover"
                />
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm text-foreground/70">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-surface py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          id="faq-heading"
          eyebrow="Good to know"
          title="Frequently asked questions"
          text="Straight answers about credits, payouts and safety."
        />
        <Reveal>
          <Accordion className="w-full">
            {FAQS.map((f, i) => (
              <Accordion.Item key={f.q} id={`faq-${i}`}>
                <Accordion.Heading>
                  <Accordion.Trigger className="min-h-12 text-left font-semibold">
                    {f.q}
                    <Accordion.Indicator />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body className="text-foreground/75">{f.a}</Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section aria-labelledby="cta-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-center text-white sm:px-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/25 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl space-y-5">
            <h2 id="cta-heading" className="font-heading text-3xl font-extrabold sm:text-4xl">
              Ready to bring your idea to life?
            </h2>
            <p className="text-white/85">
              Create a free account today. You will start with free credits, and your first campaign can be
              live as soon as an admin approves it.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/register"
                className={`${buttonVariants({ variant: "primary", size: "lg" })} min-h-12`}
              >
                Create free account
              </Link>
              <Link
                href="/campaigns"
                className="inline-flex min-h-12 items-center rounded-full border border-white/70 px-6 font-medium transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse campaigns
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

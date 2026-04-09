import { TopNav } from "@/components/layout/TopNav";
import { Scale, FileText, Search, CheckCircle, Shield } from "lucide-react";

export default function MethodologyPage() {
  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="h-6 w-6 text-stone-400" />
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">
            Methodology
          </h1>
        </div>

        <div className="prose prose-stone prose-sm max-w-none space-y-8">
          <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-stone-400" />
              <h2 className="text-base font-medium text-stone-700 m-0">
                What We Track
              </h2>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              We document public statements made by individuals and
              organizations that contain specific, verifiable claims about future
              actions or outcomes. These include promises, predictions,
              commitments, and factual claims. We do not track opinions,
              preferences, or statements that are clearly rhetorical.
            </p>
          </section>

          <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-stone-400" />
              <h2 className="text-base font-medium text-stone-700 m-0">
                Source Standards
              </h2>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">
              All statements are sourced from publicly available records.
              Accepted source types include:
            </p>
            <ul className="text-sm text-stone-600 space-y-1 list-disc list-inside">
              <li>Official speeches and testimony</li>
              <li>Press conferences and interviews</li>
              <li>Published reports and documents</li>
              <li>Official social media accounts</li>
              <li>News articles with direct quotes</li>
            </ul>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">
              Each statement includes a link to the original source when
              available. Anonymous sources or unverified leaks are not included.
            </p>
          </section>

          <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-stone-400" />
              <h2 className="text-base font-medium text-stone-700 m-0">
                Classification System
              </h2>
            </div>
            <div className="space-y-4 text-sm text-stone-600">
              <div>
                <h4 className="font-medium text-stone-700">Status Categories</h4>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="inline-block w-24 font-medium text-emerald-700">Kept</span>
                    <span>The stated action or outcome has been verified as fulfilled.</span>
                  </div>
                  <div>
                    <span className="inline-block w-24 font-medium text-amber-700">Delayed</span>
                    <span>The implied or stated deadline has passed without fulfillment, but the action may still be in progress.</span>
                  </div>
                  <div>
                    <span className="inline-block w-24 font-medium text-red-700">Contradicted</span>
                    <span>Evidence shows the opposite of the stated outcome has occurred, or the speaker has reversed the position.</span>
                  </div>
                  <div>
                    <span className="inline-block w-24 font-medium text-slate-600">Unresolved</span>
                    <span>The deadline has not yet passed or insufficient evidence exists to determine the outcome.</span>
                  </div>
                  <div>
                    <span className="inline-block w-24 font-medium text-slate-400">Too Vague</span>
                    <span>The statement lacks specific, measurable criteria that would allow for objective verification.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-stone-700">Confidence Score (1–5)</h4>
                <p className="mt-1">
                  Reflects the specificity and verifiability of the original
                  statement, not our confidence in the outcome. A score of 5
                  means the statement contains a clear, measurable outcome
                  with a specific deadline. A score of 1 means the statement
                  is largely aspirational.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-stone-400" />
              <h2 className="text-base font-medium text-stone-700 m-0">
                Editorial Standards
              </h2>
            </div>
            <div className="text-sm text-stone-600 leading-relaxed space-y-3">
              <p>
                All classifications are made by human reviewers following the
                above criteria. Automated tools may assist with identifying
                potential statements from public sources, but all approvals
                and classifications are manual.
              </p>
              <p>
                We use neutral, factual language throughout. We do not use
                terms like &ldquo;broken promise,&rdquo; &ldquo;lie,&rdquo;
                or &ldquo;failure.&rdquo; We present evidence and let readers
                draw their own conclusions.
              </p>
              <p>
                If you believe a statement has been misclassified or is
                missing relevant context, you can submit a correction through
                the &ldquo;Report correction&rdquo; link on any statement
                page.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

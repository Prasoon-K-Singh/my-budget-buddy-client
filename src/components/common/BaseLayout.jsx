import Topbar from "./Topbar";

const BaseLayout = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-400 px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
        <Topbar />
        <main className="mt-8">
          <section className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6 lg:p-8">
            <header className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {description && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="h-8 w-1 rounded-full bg-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {description}
                  </p>
                </div>
              )}
            </header>
            <div>{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;

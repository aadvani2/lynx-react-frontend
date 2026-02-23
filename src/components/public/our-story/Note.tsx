const Note = () => {
  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10 note-from-the">
        <div
          className="card image-wrapper bg-full bg-soft-aqua mb-12"
          data-image-src="./assets/img/photos/bg22.png"
        >
          <div className="card-body py-6 px-6">
            <div className="row">
              <div
                className="col-xxl-10 mx-auto"
              >
                <h4 className="section-title font-bricolage mb-md-5 mb-2">
                  A Note from the Lynx Team
                </h4>
                <p className="m-0">
                  We started Lynx because we’ve lived both sides of the home
                  services struggle. We’ve been the homeowners who needed help
                  but didn’t have time to make five phone calls. And we’ve been
                  the ones trying to fix things ourselves—until we realized we
                  didn’t have the right tool (or the right weekend).
                  <br />
                  <br />
                  Lynx exists to make things simpler—for everyone.
                  <br />
                  <br />
                  If you’re a customer, we want you to feel confident that the
                  person we’re sending to your door is someone we’d trust at
                  ours. Someone skilled, respectful, and ready to get the job
                  done right—not just today, but the next time you need help,
                  too.
                  <br />
                  <br />
                  If you’re a provider, we want you to know this: Lynx isn’t
                  here to waste your time. We’re not selling leads. We’re
                  building something better. You deserve a platform that
                  respects your work, protects your time, and partners with you
                  to grow your business alongside a group of high-quality pros
                  who’ve earned their stripes.
                  <br />
                  <br />
                  We won’t pretend we’ll always get everything right. But we can
                  promise we’ll go the extra mile, every time, to make it right.
                  <br />
                  <br />
                  Thanks for being here.
                  <br />— The Lynx Team
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row gx-md-5 gy-5 align-items-center">
          <div className="col-xxl-10 mx-auto">
            <div
              className="text-center"
            >
              <h3 className="section-title mb-4 ">
                The day everything broke — and no one showed up.
              </h3>
              <p>
                It was 102 degrees. The AC quit. One call turned into five.
                Everyone said the same thing: “Can’t come today.” When someone
                finally did show up? They made it worse. Two more days. Extra
                costs. Hours wasted. All avoidable.
              </p>
              <p>That’s why we built Lynx.</p>
              <p>
                Because no one should have to beg for help at home — or guess
                who they can trust.
              </p>
            </div>

            <div className="my-6">
              <div>
                <h3 className="section-title pt-4 mb-4 text-center">
                  We connect you to one top-rated, licensed pro - fast.
                </h3>
                <p className="mb-8 text-center">
                  No lists. No spam. No quoting games.{" "}
                </p>
              </div>
              <div
                className="row gx-lg-8 gx-xl-12 gy-6 process-wrapper line mobile-text-center text-md-center text-lg-start"
              >
                <div className="col-md-6 col-lg-3">
                  <span className="icon btn btn-circle btn-lg btn-soft-aqua text-primary pe-none mb-4">
                    <span className="number">01</span>
                  </span>
                  <p className="fs-15 mb-1">You tell us what’s wrong.</p>
                </div>
                <div className="col-md-6 col-lg-3">
                  <span className="icon btn btn-circle btn-lg btn-soft-aqua text-primary pe-none mb-4">
                    <span className="number">02</span>
                  </span>
                  <p className="fs-15 mb-1">
                    We send one trusted professional.
                  </p>
                </div>
                <div className="col-md-6 col-lg-3">
                  <span className="icon btn btn-circle btn-lg btn-soft-aqua text-primary pe-none mb-4">
                    <span className="number">03</span>
                  </span>
                  <p className="fs-15 mb-1">
                    They show up, do the job
                    <br />
                    and you pay them directly.
                  </p>
                </div>
                <div className="col-md-6 col-lg-auto">
                  <span className="icon btn btn-circle btn-lg btn-soft-aqua text-primary pe-none mb-4">
                    <span className="number">04</span>
                  </span>
                  <p className="fs-15 mb-1">That’s it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Note;

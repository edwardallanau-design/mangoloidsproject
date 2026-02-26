export default function RecruitmentPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Join Our Guild</h1>
        <p className="text-lg text-foreground/70">
          Are you ready to become a legend? Apply to join Mangoloids today.
        </p>
      </div>

      {/* Application Form */}
      <div className="mx-auto max-w-2xl rounded-lg border border-primary/20 bg-primary/5 p-8">
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Summoner Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your in-game name"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-foreground">
              Main Role
            </label>
            <select
              id="role"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option>Select a role</option>
              <option>Top</option>
              <option>Jungle</option>
              <option>Mid</option>
              <option>ADC</option>
              <option>Support</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-foreground">
              Why do you want to join?
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us about yourself..."
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

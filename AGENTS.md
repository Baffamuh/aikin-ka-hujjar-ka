<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Public site pages live under the `_site` pathless layout (header/footer); admin pages are `admin.*` routes gated in `admin.tsx` (client-only beforeLoad + `user_roles` admin check); `/admin/login` is `admin_.login.tsx` so it escapes the gate.
- Citizens never read/write `complaints` directly: inserts go through `submit_complaint` RPC and public tracking through `track_complaint` RPC (security definer, returns no personal details).
- The first account created becomes admin via the `handle_first_admin` trigger; later signups get no role.
- Admin uploads go to the private `site-media` bucket and are stored as long-lived signed URLs (workspace blocks public buckets).

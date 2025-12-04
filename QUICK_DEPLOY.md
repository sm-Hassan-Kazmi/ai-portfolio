# Quick Deploy Reference

## 🚀 Deploy in 3 Steps

### 1. Verify Project
```bash
npm run verify-deployment
```

### 2. Deploy to Vercel
```bash
npx vercel --prod
```

### 3. Test Deployment
Visit your deployment URL and test these commands:
- `help`
- `about`
- `skills`
- `projects`
- `theme cyberpunk`

## 📋 Quick Checklist

- [ ] Build passes locally (`npm run build`)
- [ ] Deployed to Vercel
- [ ] Terminal loads on deployment URL
- [ ] Commands work correctly
- [ ] No console errors

## 🔗 Important Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deploy New Project:** https://vercel.com/new
- **Full Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Detailed Checklist:** See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 🆘 Quick Troubleshooting

**Build fails?**
```bash
npm run type-check
npm run build
```

**Deployment succeeds but site doesn't load?**
- Check browser console for errors
- Verify `app/page.tsx` exists
- Check Vercel build logs

**Need help?**
- See DEPLOYMENT.md troubleshooting section
- Check Vercel documentation: https://vercel.com/docs

---

**Ready to deploy?** Run `npx vercel --prod` 🚀

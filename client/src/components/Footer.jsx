import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='mt-40 bg-[#0F172A] text-gray-400 relative overflow-hidden'>
        {/* Decorative background element */}
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2'></div>

        <div className='px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
                {/* Brand Section */}
                <div className='space-y-6'>
                    <img src={assets.logo} alt="logo" className='h-9 brightness-200' />
                    <p className='text-sm leading-relaxed max-w-xs'>
                        Redefining the luxury car rental experience with premium vehicles and seamless service across India.
                    </p>
                    <div className='flex items-center gap-4'>
                        {[
                            { icon: assets.facebook_logo, link: "#" },
                            { icon: assets.instagram_logo, link: "#" },
                            { icon: assets.twitter_logo, link: "#" },
                            { icon: assets.gmail_logo, link: "mailto:support@carrental.com" }
                        ].map((social, i) => (
                            <a key={i} href={social.link} className='w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-white/10'>
                                <img src={social.icon} className='w-4 h-4 brightness-200' alt="" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className='text-white font-bold mb-6 text-lg'>Quick Links</h3>
                    <ul className='space-y-4 text-sm'>
                        <li><Link to="/" className='hover:text-primary transition-colors'>Home</Link></li>
                        <li><Link to="/cars" className='hover:text-primary transition-colors'>Browse Fleet</Link></li>
                        <li><Link to="/contact" className='hover:text-primary transition-colors'>Contact Us</Link></li>
                        <li><a href="#" className='hover:text-primary transition-colors'>About Company</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className='text-white font-bold mb-6 text-lg'>Support</h3>
                    <ul className='space-y-4 text-sm'>
                        <li><a href="#" className='hover:text-primary transition-colors'>Help Center</a></li>
                        <li><a href="#" className='hover:text-primary transition-colors'>Terms of Service</a></li>
                        <li><a href="#" className='hover:text-primary transition-colors'>Privacy Policy</a></li>
                        <li><a href="#" className='hover:text-primary transition-colors'>Insurance Policy</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className='text-white font-bold mb-6 text-lg'>Head Office</h3>
                    <ul className='space-y-4 text-sm'>
                        <li className='flex items-start gap-3'>
                            <img src={assets.location_icon} className='w-4 h-4 mt-1 brightness-200' alt="" />
                            <span>1234 Luxury Drive, BKC,<br/>Mumbai, Maharashtra 400051</span>
                        </li>
                        <li className='flex items-center gap-3'>
                            <img src={assets.users_icon} className='w-4 h-4 brightness-200' alt="" />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className='flex items-center gap-3'>
                            <img src={assets.gmail_logo} className='w-4 h-4 brightness-200' alt="" />
                            <span>support@carrental.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-wider'>
                <p>© {new Date().getFullYear()} CarRental. Crafted for Excellence.</p>
                <div className='flex items-center gap-8 text-gray-500'>
                    <a href="#" className='hover:text-white transition-colors'>Privacy</a>
                    <a href="#" className='hover:text-white transition-colors'>Terms</a>
                    <a href="#" className='hover:text-white transition-colors'>Sitemap</a>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer

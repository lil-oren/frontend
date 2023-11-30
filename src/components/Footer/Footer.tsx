import Divider from '@/components/Divider/Divider';
import { withBasePath } from '@/lib/nextUtils';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="w-full bg-white mt-5">
      <div className="flex flex-col lg:hidden">
        <div className="need-help contact-us flex flex-row justify-center items-center gap-2 mt-5">
          <Image
            src={withBasePath('headphone.svg')}
            width={50}
            height={50}
            alt="cs"
            className="border-[1px] p-2 rounded-full shadow-sm w-[35px] h-[35px]"
          />
          <p className="font-semibold text-[12px]">Need help?</p>
          <p className="text-primary text-[12px]">contact us</p>
        </div>
        <div className="p-4">
          <p className="text-[12px] text-center">
            {
              'LilOren, the most complete & trusted online shop with a variety of selected products and attractive promotions'
            }
          </p>
        </div>
        <Divider />
      </div>
      <div className="justify-center hidden lg:flex">
        <div className="lg:flex flex-col w-[75vw]">
          {/* Head */}
          <div className="footer__head flex flex-row justify-between py-8 border-b-[1px] items-center">
            <div className="footer__brand flex itemx-center">
              <div className="footer__brandimage mr-4">
                <Link
                  href={'/'}
                  className="hidden md:block font-bold text-primary md:text-[24px]"
                >
                  LilOren
                </Link>
              </div>
              <div className="footer__brandtext">
                <p className="font-[25px] leading-[33px]">
                  {'Online shop with a mall-style shopping sensation.'}
                </p>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="footer_body flex border-b-[1px] py-8">
            {/* Grid 1 */}
            <div className="footer_grid flex-1">
              <div className="footer_item">
                <div className="footer_item_title text-[20px] mt-0 mb-6 font-bold">
                  {'Customer Care'}
                </div>
                {/* Email */}
                <div className="footer_contact mb-4">
                  <div className="footer_contact-title block text-[14px] leading-[21px] border-box text-muted-foreground">
                    {'Email'}
                  </div>
                  <div className="footer_contact-content block text-[16px] leading-[21px] font-semibold">
                    {'orenpostman@gmail.com'}
                  </div>
                </div>
                {/* CS */}
                <div className="footer_contact mb-4">
                  <div className="footer_contact-title block text-[14px] leading-[21px] border-box text-muted-foreground">
                    {'Help'}
                  </div>
                  <div className="footer_contact-content block text-[16px] leading-[21px] font-semibold text-primary">
                    {'Help Center'}
                  </div>
                </div>
              </div>
            </div>
            {/* Grid 2 */}
            <div className="footer_grid flex-1">
              <div className="footer_item">
                <div className="footer_item_title text-[20px] mt-0 mb-6 font-bold">
                  {'LilOren Info'}
                </div>
                <ul className="footer_item-menu text-[16px] leading-[21px] text-muted-foreground">
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'About LilOren'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'LIlOren Friends Blog'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Press conference'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Latest News'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Career'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Terms & Privacy Policy'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Intellectual property rights'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Friends of Smart Mothers'}
                  </li>
                </ul>
              </div>
            </div>
            {/* Grid 3 */}
            <div className="footer_grid flex-1">
              <div className="footer_item">
                <div className="footer_item_title text-[20px] mt-0 mb-6 font-bold">
                  {'Cooperation'}
                </div>
                <ul className="footer_item-menu text-[16px] leading-[21px] text-muted-foreground">
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Affiliate Program'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'Sell on LilOren'}
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    {'B2B Programs'}
                  </li>
                </ul>
              </div>
            </div>
            {/* Grid 4 */}
            <div className="footer_grid flex-1">
              <div className="footer_item mb-10">
                <div className="footer_item_title text-[20px] mt-0 mb-6 font-bold">
                  {'Follow Us'}
                </div>
                <ul className="footer_social flex gap-3 text-[16px] leading-[21px] text-muted-foreground items-center">
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    <div className="bg-white rounded-full p-2 border-[1px] hover:bg-muted">
                      <Instagram color="gray" />
                    </div>
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    <div className="bg-white rounded-full p-2 border-[1px] hover:bg-muted">
                      <Facebook fill="gray" color="gray" />
                    </div>
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    <div className="bg-white rounded-full p-2 border-[1px] hover:bg-muted">
                      <Youtube color="gray" />
                    </div>
                  </li>
                </ul>
              </div>
              <div className="footer_item mb-10">
                <div className="footer_item_title text-[20px] mt-0 mb-6 font-bold">
                  {'Partner'}
                </div>
                <ul className="footer_social flex gap-3 text-[16px] leading-[21px] text-muted-foreground items-center">
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    <Image
                      src={
                        'https://www.static-src.com/siva/asset//03_2023/JNE.png?w=120'
                      }
                      width={100}
                      height={100}
                      alt="partner"
                    />
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    <Image
                      src={
                        'https://www.tikibanjarmasin.com/images/Logo-TIKI.png'
                      }
                      width={150}
                      height={150}
                      alt="partner"
                    />
                  </li>
                  <li className="text-[16px] mb-3 text-left leading-[21px] hover:text-primary hover:cursor-pointer">
                    <Image
                      src={
                        'https://play-lh.googleusercontent.com/jSr8HN-Y_n2D47SMA4ppdcyxr1lrp4ISOJeO2Oztmo7nTwu_WpS_6KVB7Y4kpLZECA=w3840-h2160-rw'
                      }
                      width={120}
                      height={120}
                      alt="partner"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className="footer_bottom leading-[21px] text-[16px] font-semibold">
            <div className="footer_bottom-content flex justify-between leading-[21px] py-5 ">
              <div className="footer_bottom__right text-[16px] leading-[21px] ">
                <div className="footer_bottom_right__copy mr-[10px] text-[16px] ">
                  <div className="flex flex-row gap-2 items-center">
                    <p className="LilOren © 2023 | ">LilOren © 2023 | </p>
                    <p className="LilOren © 2023 | ">
                      Online shop with a mall-style shopping sensation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

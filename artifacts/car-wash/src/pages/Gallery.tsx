import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Link } from "wouter";
import {
  Phone, MapPin, Clock, Send, Sparkles, Images, X, ChevronLeft, ChevronRight,
  Facebook, Twitter,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";

/* ── Gallery photos with brand tags ─────────────────────────────── */
type Photo = { url: string; tags: string[] };

const GALLERY_PHOTOS: Photo[] = [
  { url: "/gallery/281728729_107844885266785_5303378578669402102_n.jpg", tags: ["all"] },
  { url: "/gallery/469067110_588163777234891_69508842767169826_n.jpg", tags: ["all"] },
  { url: "/gallery/469076762_588164563901479_747758162023328896_n.jpg", tags: ["all"] },
  { url: "/gallery/469085687_588163783901557_8991347073242356037_n.jpg", tags: ["all"] },
  { url: "/gallery/469092751_588163503901585_1766949201092841397_n.jpg", tags: ["all"] },
  { url: "/gallery/469101550_588164573901478_8276470106177472653_n.jpg", tags: ["all"] },
  { url: "/gallery/469105630_588163550568247_802736432271909223_n.jpg", tags: ["all"] },
  { url: "/gallery/469107548_588164810568121_2510550393928094923_n.jpg", tags: ["all"] },
  { url: "/gallery/469113470_588163780568224_5386968476387545874_n.jpg", tags: ["all"] },
  { url: "/gallery/469113897_588164913901444_3136483372437643140_n.jpg", tags: ["all"] },
  { url: "/gallery/469122070_588164610568141_1631720173693476483_n.jpg", tags: ["all"] },
  { url: "/gallery/469123845_588163837234885_1471136540620755874_n.jpg", tags: ["all"] },
  { url: "/gallery/469124307_588163803901555_202600287933077359_n.jpg", tags: ["all"] },
  { url: "/gallery/469258069_588226777228591_6950452212700910438_n.jpg", tags: ["all"] },
  { url: "/gallery/469272954_588174223900513_2629574917546607748_n.jpg", tags: ["all"] },
  { url: "/gallery/469279335_588174213900514_4484760201393054375_n.jpg", tags: ["all"] },
  { url: "/gallery/469320926_588164537234815_5197289363598842973_n.jpg", tags: ["all"] },
  { url: "/gallery/469336903_588163830568219_7856154177356962584_n.jpg", tags: ["all"] },
  { url: "/gallery/469348142_588164550568147_7573604444509310904_n.jpg", tags: ["all"] },
  { url: "/gallery/469358823_588164570568145_3789440365437398272_n.jpg", tags: ["all"] },
  { url: "/gallery/469361538_588335713884364_7476406897764864980_n.jpg", tags: ["all"] },
  { url: "/gallery/469363008_588344760550126_6875163565464211054_n.jpg", tags: ["all"] },
  { url: "/gallery/469364925_588164900568112_2943063879076035915_n.jpg", tags: ["all"] },
  { url: "/gallery/469370982_588163513901584_4229482084882448056_n.jpg", tags: ["all"] },
  { url: "/gallery/469397194_588164560568146_6818584573377713547_n.jpg", tags: ["all"] },
  { url: "/gallery/469397710_588164607234808_3372323831096732100_n.jpg", tags: ["all"] },
  { url: "/gallery/469397965_588335690551033_1659642947977164718_n.jpg", tags: ["all"] },
  { url: "/gallery/469414463_588164577234811_369240364694821946_n.jpg", tags: ["all"] },
  { url: "/gallery/469415684_588164513901484_5794834001610611799_n.jpg", tags: ["all", "porsche"] },
  { url: "/gallery/469417141_588226967228572_1008165915881131155_n.jpg", tags: ["all"] },
  { url: "/gallery/469423751_588163813901554_474697948081211528_n.jpg", tags: ["all"] },
  { url: "/gallery/469435416_588164640568138_8143042890000568916_n.jpg", tags: ["all"] },
  { url: "/gallery/469446496_588344617216807_4504900075848556517_n.jpg", tags: ["all"] },
  { url: "/gallery/469451781_588226970561905_5659337803126787740_n.jpg", tags: ["all"] },
  { url: "/gallery/469473441_588335740551028_7786106458110091990_n.jpg", tags: ["all"] },
  { url: "/gallery/469479941_588164790568123_4345515396427818815_n.jpg", tags: ["all"] },
  { url: "/gallery/469491231_588344750550127_9160521216027204045_n.jpg", tags: ["all"] },
  { url: "/gallery/469498647_588226980561904_7510713625972131881_n.jpg", tags: ["all"] },
  { url: "/gallery/469514128_588344620550140_366382880077366855_n.jpg", tags: ["all"] },
  { url: "/gallery/469555403_588164623901473_2617584975186755798_n.jpg", tags: ["all"] },
  { url: "/gallery/469564860_588227067228562_509103556607492182_n.jpg", tags: ["all"] },
  { url: "/gallery/469570167_588163753901560_1761922679835222318_n.jpg", tags: ["all"] },
  { url: "/gallery/469583313_588335677217701_3768383964329284215_n.jpg", tags: ["all"] },
  { url: "/gallery/469584541_588163510568251_8466111576951571131_n.jpg", tags: ["all"] },
  { url: "/gallery/469584745_588163520568250_1518334541081360384_n.jpg", tags: ["all"] },
  { url: "/gallery/469596804_588164683901467_6466424299599558801_n.jpg", tags: ["all"] },
  { url: "/gallery/469631673_588164543901481_6190618404191244845_n.jpg", tags: ["all"] },
  { url: "/gallery/469649040_588163787234890_7425126766375835026_n.jpg", tags: ["all"] },
  { url: "/gallery/469649041_588164547234814_5193688281254757640_n.jpg", tags: ["all"] },
  { url: "/gallery/469779080_590935680291034_3383417112145107643_n.jpg", tags: ["all"] },
  { url: "/gallery/469829858_590917016959567_8464658735243502522_n.jpg", tags: ["all"] },
  { url: "/gallery/469874755_591591363558799_4213494992483316722_n.jpg", tags: ["all"] },
  { url: "/gallery/469883792_590916786959590_4874807245248155416_n.jpg", tags: ["all"] },
  { url: "/gallery/469899776_591591390225463_4410043047749735632_n.jpg", tags: ["all"] },
  { url: "/gallery/469908218_590916883626247_1309868892355215137_n.jpg", tags: ["all"] },
  { url: "/gallery/469908539_590935683624367_2979323053228951905_n.jpg", tags: ["all"] },
  { url: "/gallery/469920469_590935763624359_9138397607473877142_n.jpg", tags: ["all"] },
  { url: "/gallery/469998902_590935726957696_4976740159729675009_n.jpg", tags: ["all"] },
  { url: "/gallery/470002972_590935776957691_7858245740245501303_n.jpg", tags: ["all"] },
  { url: "/gallery/470004983_590916820292920_6940204029715572058_n.jpg", tags: ["all"] },
  { url: "/gallery/470028107_591591523558783_1589054227075913549_n.jpg", tags: ["all"] },
  { url: "/gallery/470032432_590916773626258_2648467030622330201_n.jpg", tags: ["all"] },
  { url: "/gallery/470065911_590936373624298_6504644052643090257_n.jpg", tags: ["all"] },
  { url: "/gallery/470140710_592585273459408_358612770963474228_n.jpg", tags: ["all"] },
  { url: "/gallery/470172916_592585276792741_5197064919885861305_n.jpg", tags: ["all"] },
  { url: "/gallery/470173262_592585063459429_6800518164476674335_n.jpg", tags: ["all"] },
  { url: "/gallery/470181114_591591463558789_4867061213991434_n.jpg", tags: ["all"] },
  { url: "/gallery/470192354_592585253459410_8022706717903274526_n.jpg", tags: ["all"] },
  { url: "/gallery/470195074_592585056792763_7864996033605086725_n.jpg", tags: ["all"] },
  { url: "/gallery/470209694_591591320225470_2254805834649948289_n.jpg", tags: ["all"] },
  { url: "/gallery/470209968_592585280126074_6283835191382421843_n.jpg", tags: ["all"] },
  { url: "/gallery/470212239_592585040126098_5608760235997221126_n.jpg", tags: ["all"] },
  { url: "/gallery/470219330_591591423558793_3074922515742601013_n.jpg", tags: ["all"] },
  { url: "/gallery/470226459_592585283459407_8323620690635930600_n.jpg", tags: ["all"] },
  { url: "/gallery/470229496_591591420225460_7737209654416779730_n.jpg", tags: ["all"] },
  { url: "/gallery/470234773_591591346892134_6760444641958229404_n.jpg", tags: ["all"] },
  { url: "/gallery/470239328_592585246792744_5130489542953594001_n.jpg", tags: ["all"] },
  { url: "/gallery/473443844_619512024100066_110027540695465171_n.jpg", tags: ["all", "mercedes"] },
  { url: "/gallery/473523900_619511960766739_3755589629688917314_n.jpg", tags: ["all", "mercedes"] },
  { url: "/gallery/473535750_619511767433425_7662701961903293797_n.jpg", tags: ["all", "bmw"] },
  { url: "/gallery/473767872_619512020766733_1364191108626878270_n.jpg", tags: ["all", "mercedes"] },
  { url: "/gallery/473801182_619512007433401_6293151158368073150_n.jpg", tags: ["all", "bmw"] },
  { url: "/gallery/473801438_619511777433424_622418808731694551_n.jpg", tags: ["all"] },
  { url: "/gallery/473808178_619511957433406_6550007255788484186_n.jpg", tags: ["all"] },
  { url: "/gallery/473811628_619511750766760_7257746062879188015_n.jpg", tags: ["all"] },
  { url: "/gallery/473812848_619511930766742_6345713691164731714_n.jpg", tags: ["all"] },
  { url: "/gallery/473814469_619511967433405_3114255152136763436_n.jpg", tags: ["all"] },
  { url: "/gallery/474001506_619511954100073_5461609372315389260_n.jpg", tags: ["all", "bmw"] },
  { url: "/gallery/474226873_619511847433417_2383582933929002531_n.jpg", tags: ["all", "mini"] },
  { url: "/gallery/474274780_619511740766761_5309422618099409675_n.jpg", tags: ["all"] },
  { url: "/gallery/474512074_619511924100076_8990223023507083925_n.jpg", tags: ["all"] },
  { url: "/gallery/474544930_619511737433428_1948027367540019012_n.jpg", tags: ["all"] },
  { url: "/gallery/474565783_619512160766719_4700608763254415855_n.jpg", tags: ["all"] },
  { url: "/gallery/474722592_619511724100096_8551748002383910885_n.jpg", tags: ["all"] },
  { url: "/gallery/474729357_619511717433430_8827703321732816302_n.jpg", tags: ["all"] },
  { url: "/gallery/474768370_619511887433413_4938583833109010141_n.jpg", tags: ["all", "bmw"] },
  { url: "/gallery/475030628_629846533066615_8526303629189371407_n.jpg", tags: ["all", "mini"] },
  { url: "/gallery/475751031_629846499733285_150717965852448166_n.jpg", tags: ["all", "mercedes"] },
  { url: "/gallery/475760913_629846126399989_4669870005838851543_n.jpg", tags: ["all", "bmw"] },
  { url: "/gallery/475781591_629846193066649_7375311991963118158_n.jpg", tags: ["all"] },
  { url: "/gallery/475789233_629846483066620_1965981284138389756_n.jpg", tags: ["all"] },
  { url: "/gallery/475798646_629846199733315_2455886928920944537_n.jpg", tags: ["all"] },
  { url: "/gallery/475830261_629846103066658_8853198848579628319_n.jpg", tags: ["all"] },
  { url: "/gallery/475839844_629846253066643_6708679788579335025_n.jpg", tags: ["all"] },
  { url: "/gallery/475888009_629846539733281_1289744271005580325_n.jpg", tags: ["all"] },
  { url: "/gallery/475902669_629846503066618_4775248021682707982_n.jpg", tags: ["all"] },
  { url: "/gallery/475912022_629846179733317_6866755362977192846_n.jpg", tags: ["all"] },
  { url: "/gallery/475917192_629846256399976_6012193763373567578_n.jpg", tags: ["all"] },
  { url: "/gallery/475963344_629846216399980_8605994482724122301_n.jpg", tags: ["all"] },
  { url: "/gallery/475970490_629846113066657_3540241492002768572_n.jpg", tags: ["all"] },
  { url: "/gallery/475974486_629846139733321_4762871921198388254_n.jpg", tags: ["all"] },
  { url: "/gallery/475976436_629846206399981_1300974720811917291_n.jpg", tags: ["all"] },
  { url: "/gallery/475986905_629846099733325_2882358042294758496_n.jpg", tags: ["all"] },
  { url: "/gallery/476084931_629846203066648_8528781011904067403_n.jpg", tags: ["all"] },
  { url: "/gallery/476091951_629846143066654_5879898241894692455_n.jpg", tags: ["all"] },
  { url: "/gallery/476099422_629846176399984_5492706526535553028_n.jpg", tags: ["all"] },
  { url: "/gallery/476224009_629846156399986_1815593081995095268_n.jpg", tags: ["all"] },
  { url: "/gallery/476250819_629846476399954_98151476843763614_n.jpg", tags: ["all"] },
  { url: "/gallery/476307049_629846233066645_1360130429855047582_n.jpg", tags: ["all"] },
  { url: "/gallery/476792167_634491822602086_2504418294743219244_n.jpg", tags: ["all"] },
  { url: "/gallery/476795412_634491929268742_4380538035174520642_n.jpg", tags: ["all"] },
  { url: "/gallery/476798824_634491809268754_7484736706309138399_n.jpg", tags: ["all"] },
  { url: "/gallery/476799446_634491905935411_7874017041763381411_n.jpg", tags: ["all"] },
  { url: "/gallery/476799657_634491899268745_760539484926745306_n.jpg", tags: ["all"] },
  { url: "/gallery/476800266_634491805935421_3758994738446328058_n.jpg", tags: ["all"] },
  { url: "/gallery/476813714_634491835935418_1046014538870144515_n.jpg", tags: ["all"] },
  { url: "/gallery/477011514_634491579268777_7468508855812536071_n.jpg", tags: ["all"] },
  { url: "/gallery/477018627_634491869268748_1296225385065470374_n.jpg", tags: ["all"] },
  { url: "/gallery/477481846_634491882602080_7664468440660185813_n.jpg", tags: ["all"] },
  { url: "/gallery/477577507_634491555935446_3443949064828684173_n.jpg", tags: ["all"] },
  { url: "/gallery/477734833_634491812602087_8323454194227598937_n.jpg", tags: ["all"] },
  { url: "/gallery/477798099_634491572602111_5243166459596210955_n.jpg", tags: ["all"] },
  { url: "/gallery/477803004_634491819268753_2172532458414564434_n.jpg", tags: ["all"] },
  { url: "/gallery/477803621_634491879268747_1098437884070005897_n.jpg", tags: ["all"] },
  { url: "/gallery/479542184_634491885935413_8316929087696741208_n.jpg", tags: ["all"] },
  { url: "/gallery/479691519_636763312374937_1500602704460985303_n.jpg", tags: ["all"] },
  { url: "/gallery/479698584_636762985708303_6792435419636687417_n.jpg", tags: ["all"] },
  { url: "/gallery/479701889_636763329041602_869764366563522334_n.jpg", tags: ["all"] },
  { url: "/gallery/479910714_636763035708298_1441033904368978737_n.jpg", tags: ["all"] },
  { url: "/gallery/479972962_636763302374938_4282153256986376480_n.jpg", tags: ["all"] },
  { url: "/gallery/479982377_636763322374936_4496107338875175963_n.jpg", tags: ["all"] },
  { url: "/gallery/480026320_636763125708289_749561538055028422_n.jpg", tags: ["all"] },
  { url: "/gallery/480099416_636763129041622_3695557696389448782_n.jpg", tags: ["all"] },
  { url: "/gallery/480174038_636763109041624_2553320472139475026_n.jpg", tags: ["all"] },
  { url: "/gallery/480238029_636762905708311_547865703873449200_n.jpg", tags: ["all"] },
  { url: "/gallery/480272166_636763305708271_8327651512437433913_n.jpg", tags: ["all"] },
  { url: "/gallery/480291329_636763309041604_837422849472995800_n.jpg", tags: ["all"] },
  { url: "/gallery/480293206_636763135708288_1066376165539010338_n.jpg", tags: ["all"] },
  { url: "/gallery/480297929_636763229041612_1442421382127329354_n.jpg", tags: ["all"] },
  { url: "/gallery/480317697_636763225708279_2182117413810732198_n.jpg", tags: ["all"] },
  { url: "/gallery/480429182_636763299041605_3819437241462018184_n.jpg", tags: ["all"] },
  { url: "/gallery/480441033_636762862374982_6019389397761868738_n.jpg", tags: ["all"] },
  { url: "/gallery/481016464_649280767789858_6085290403859775272_n.jpg", tags: ["all"] },
  { url: "/gallery/481025801_649280844456517_3319875067474441288_n.jpg", tags: ["all"] },
  { url: "/gallery/481041557_649280917789843_7763610846302727589_n.jpg", tags: ["all"] },
  { url: "/gallery/481046724_649280817789853_1769730783239335467_n.jpg", tags: ["all"] },
  { url: "/gallery/481056641_649280801123188_8330447061360966666_n.jpg", tags: ["all"] },
  { url: "/gallery/481058734_649280807789854_1465636496435066903_n.jpg", tags: ["all"] },
  { url: "/gallery/481060007_650576970993571_222217482336810391_n.jpg", tags: ["all"] },
  { url: "/gallery/481060195_650576937660241_5936371274587859996_n.jpg", tags: ["all"] },
  { url: "/gallery/481073017_649280864456515_1826433829123698946_n.jpg", tags: ["all"] },
  { url: "/gallery/481076621_650576947660240_6055980253631436299_n.jpg", tags: ["all"] },
  { url: "/gallery/481077089_649280857789849_7596518361391029728_n.jpg", tags: ["all"] },
  { url: "/gallery/481077262_649280761123192_116376847272579107_n.jpg", tags: ["all"] },
  { url: "/gallery/481078100_649280871123181_5776794002682879347_n.jpg", tags: ["all"] },
  { url: "/gallery/481078632_650577070993561_610051608110452572_n.jpg", tags: ["all"] },
  { url: "/gallery/481079354_649280877789847_6212455063019241814_n.jpg", tags: ["all"] },
  { url: "/gallery/481080587_650585294326072_7875542424418813607_n.jpg", tags: ["all"] },
  { url: "/gallery/481080603_650585190992749_4356877086375518340_n.jpg", tags: ["all"] },
  { url: "/gallery/481080650_650577077660227_3725880462873393750_n.jpg", tags: ["all"] },
  { url: "/gallery/481082070_649280851123183_4789144982601111418_n.jpg", tags: ["all"] },
  { url: "/gallery/481082136_649280854456516_7682828353858875527_n.jpg", tags: ["all"] },
  { url: "/gallery/481083109_649280841123184_2965725114644610341_n.jpg", tags: ["all"] },
  { url: "/gallery/481083298_649280867789848_861572461892609871_n.jpg", tags: ["all"] },
  { url: "/gallery/481084069_649280824456519_8597126507562826649_n.jpg", tags: ["all"] },
  { url: "/gallery/481307593_650585344326067_7006432955567131162_n.jpg", tags: ["all"] },
  { url: "/gallery/481356757_650585307659404_2215685171263890558_n.jpg", tags: ["all"] },
  { url: "/gallery/481464124_650576944326907_811614390717106727_n.jpg", tags: ["all"] },
  { url: "/gallery/481465893_650576960993572_6965320166612582745_n.jpg", tags: ["all"] },
  { url: "/gallery/481466890_649280831123185_2493148872310451196_n.jpg", tags: ["all"] },
  { url: "/gallery/481467653_650577060993562_4376260030084531492_n.jpg", tags: ["all"] },
  { url: "/gallery/481495150_650576694326932_3890125976371231465_n.jpg", tags: ["all"] },
  { url: "/gallery/481547094_650576934326908_8146217011219490088_n.jpg", tags: ["all"] },
  { url: "/gallery/481571647_650576837660251_5797223086303629103_n.jpg", tags: ["all"] },
  { url: "/gallery/481572595_649280764456525_7430482753578364966_n.jpg", tags: ["all"] },
  { url: "/gallery/481658139_649280861123182_1176338773793659743_n.jpg", tags: ["all"] },
  { url: "/gallery/481770813_650576580993610_7426056486938638569_n.jpg", tags: ["all"] },
  { url: "/gallery/481781108_649280771123191_4966222706278735170_n.jpg", tags: ["all"] },
  { url: "/gallery/481809265_650577057660229_3372170825270408578_n.jpg", tags: ["all"] },
  { url: "/gallery/481815289_649280811123187_3883027333837086526_n.jpg", tags: ["all"] },
  { url: "/gallery/481823021_650585337659401_1549539256647299530_n.jpg", tags: ["all"] },
  { url: "/gallery/481913880_649280791123189_8599730794100985366_n.jpg", tags: ["all"] },
  { url: "/gallery/481914426_650577067660228_2511729193084956979_n.jpg", tags: ["all"] },
  { url: "/gallery/481916496_650585544326047_6081210042800467074_n.jpg", tags: ["all"] },
  { url: "/gallery/481917211_650576984326903_2161935437122372370_n.jpg", tags: ["all"] },
  { url: "/gallery/482051125_650585157659419_643554100434132434_n.jpg", tags: ["all"] },
  { url: "/gallery/482052056_650576700993598_8609503630300042854_n.jpg", tags: ["all"] },
  { url: "/gallery/482057265_650576967660238_5875422941798604276_n.jpg", tags: ["all"] },
  { url: "/gallery/482057327_650576697660265_1626721181978452965_n.jpg", tags: ["all"] },
  { url: "/gallery/482060543_650576974326904_7535568531641340910_n.jpg", tags: ["all"] },
  { url: "/gallery/482069216_649280847789850_6512210237072977406_n.jpg", tags: ["all"] },
  { url: "/gallery/482075598_650576954326906_2698679601027612859_n.jpg", tags: ["all"] },
  { url: "/gallery/482075870_650576930993575_7565332953198424673_n.jpg", tags: ["all"] },
  { url: "/gallery/482075873_650577064326895_3426018020089130425_n.jpg", tags: ["all"] },
  { url: "/gallery/482083268_650585217659413_5986183003189104178_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/482087141_649280827789852_9199823664583488061_n.jpg", tags: ["all"] },
  { url: "/gallery/482094760_650576684326933_1173475230317797900_n.jpg", tags: ["all"] },
  { url: "/gallery/482096578_649280797789855_9217951449618504499_n.jpg", tags: ["all"] },
  { url: "/gallery/482198624_650585164326085_6555153712048078121_n.jpg", tags: ["all"] },
  { url: "/gallery/482201588_650577054326896_7062578753872270273_n.jpg", tags: ["all"] },
  { url: "/gallery/482214082_650585154326086_9220715823065746779_n.jpg", tags: ["all"] },
  { url: "/gallery/482242788_650576977660237_5389485773169806514_n.jpg", tags: ["all"] },
  { url: "/gallery/482244954_650585587659376_6877334967617575468_n.jpg", tags: ["all"] },
  { url: "/gallery/516839446_745437964840804_7406371077779077697_n.jpg", tags: ["all", "mini"] },
  { url: "/gallery/516887103_745437798174154_273580891758286555_n.jpg", tags: ["all", "ferrari"] },
  { url: "/gallery/517115344_745437934840807_7594245145680153131_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/517370738_745437734840827_3795225164762659203_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/518012578_745437864840814_6876246571923067153_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/518254459_745437901507477_5259856767592016968_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/518315796_745438034840797_1271932863752682018_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/518352435_745437754840825_2674201468873826579_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/518356691_775798791804721_4329112330972298455_n.jpg", tags: ["all"] },
  { url: "/gallery/522425719_758636143520986_3967150989664583097_n.jpg", tags: ["all"] },
  { url: "/gallery/522445920_758636240187643_3845004429252191362_n.jpg", tags: ["all"] },
  { url: "/gallery/522585131_758636173520983_6281772512278102305_n.jpg", tags: ["all"] },
  { url: "/gallery/522586815_758636126854321_700722054054125525_n.jpg", tags: ["all"] },
  { url: "/gallery/522612304_758636226854311_5206775896256299282_n.jpg", tags: ["all"] },
  { url: "/gallery/522685292_758636213520979_144554457473356212_n.jpg", tags: ["all"] },
  { url: "/gallery/522695438_758636356854298_2807910780585160363_n.jpg", tags: ["all"] },
  { url: "/gallery/523108751_758636186854315_4916434020043872107_n.jpg", tags: ["all"] },
  { url: "/gallery/523399433_758636370187630_5661677192431568564_n.jpg", tags: ["all"] },
  { url: "/gallery/523785162_758636320187635_6490348119301857709_n.jpg", tags: ["all"] },
  { url: "/gallery/524077304_758636400187627_5598313255856759423_n.jpg", tags: ["all"] },
  { url: "/gallery/524423062_758636266854307_1521952328219996312_n.jpg", tags: ["all"] },
  { url: "/gallery/532331266_775798801804720_3528521867458357296_n.jpg", tags: ["all"] },
  { url: "/gallery/533168709_775798721804728_774673263564636152_n.jpg", tags: ["all"] },
  { url: "/gallery/533405542_775798711804729_649600308428699991_n.jpg", tags: ["all"] },
  { url: "/gallery/533520285_775798828471384_2706803553611051240_n.jpg", tags: ["all"] },
  { url: "/gallery/533550609_775798761804724_8785823969028801375_n.jpg", tags: ["all"] },
  { url: "/gallery/533819430_775798771804723_8184034923941240033_n.jpg", tags: ["all"] },
  { url: "/gallery/533954539_775798741804726_3047298254753232223_n.jpg", tags: ["all"] },
  { url: "/gallery/538074368_786291270755473_3876620829441520899_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/538594171_786291237422143_7514576524997788606_n.jpg", tags: ["all"] },
  { url: "/gallery/539054522_786291324088801_4912547299741950370_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/539138148_786291310755469_2430519039124318781_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/539293951_786291354088798_3734239508102612771_n.jpg", tags: ["all"] },
  { url: "/gallery/539389415_786291250755475_7856596889094600313_n.jpg", tags: ["all"] },
  { url: "/gallery/539430566_786291207422146_1029415163276130955_n.jpg", tags: ["all"] },
  { url: "/gallery/540435560_786291280755472_678271375966164992_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/540450864_786291214088812_7363000140276359069_n.jpg", tags: ["all"] },
  { url: "/gallery/540463169_786049840779616_3456815407505550587_n.jpg", tags: ["all"] },
  { url: "/gallery/540531198_786291334088800_8479064487703149779_n.jpg", tags: ["all"] },
  { url: "/gallery/540750281_789955360389064_3139965699032988633_n.jpg", tags: ["all"] },
  { url: "/gallery/540944215_786048857446381_3623898936663310403_n.jpg", tags: ["all"] },
  { url: "/gallery/559419126_825155896869010_5204867211108474419_n.jpg", tags: ["all", "landrover"] },
  { url: "/gallery/559514832_825156050202328_8664099457518787964_n.jpg", tags: ["all"] },
  { url: "/gallery/559658217_825156020202331_5893594857405018462_n.jpg", tags: ["all"] },
  { url: "/gallery/559721308_825156016868998_7361243688863711681_n.jpg", tags: ["all"] },
  { url: "/gallery/560003241_825156130202320_6220552277941005373_n.jpg", tags: ["all"] },
  { url: "/gallery/560187375_825156156868984_8735643975062086016_n.jpg", tags: ["all"] },
  { url: "/gallery/560225394_825156073535659_3124405552037280827_n.jpg", tags: ["all"] },
  { url: "/gallery/560405651_825156113535655_8430187919349912008_n.jpg", tags: ["all"] },
  { url: "/gallery/560653591_825156136868986_7853571142514927174_n.jpg", tags: ["all"] },
  { url: "/gallery/561329198_825155923535674_3049174866307637837_n.jpg", tags: ["all"] },
  { url: "/gallery/561583265_825156043535662_1225304095801914967_n.jpg", tags: ["all"] },
  { url: "/gallery/561805975_825156106868989_9115063994802789393_n.jpg", tags: ["all"] },
  { url: "/gallery/561833155_825156080202325_2159252423628187642_n.jpg", tags: ["all"] },
  { url: "/gallery/561860318_825155970202336_2228466664940991134_n.jpg", tags: ["all"] },
  { url: "/gallery/561946185_825155960202337_7185522470853272148_n.jpg", tags: ["all"] },
  { url: "/gallery/564005525_825156166868983_6049044700085441505_n.jpg", tags: ["all"] },
  { url: "/gallery/565159494_825156196868980_6302073314963595812_n.jpg", tags: ["all"] },
];

/* ── Brand filter tags ───────────────────────────────────────────── */
const TAGS = [
  { id: "all", label: "All Cars", count: GALLERY_PHOTOS.length },
  { id: "ferrari", label: "Ferrari", count: GALLERY_PHOTOS.filter(p => p.tags.includes("ferrari")).length },
  { id: "porsche", label: "Porsche", count: GALLERY_PHOTOS.filter(p => p.tags.includes("porsche")).length },
  { id: "landrover", label: "Land Rover & Range Rover", count: GALLERY_PHOTOS.filter(p => p.tags.includes("landrover")).length },
  { id: "mercedes", label: "Mercedes", count: GALLERY_PHOTOS.filter(p => p.tags.includes("mercedes")).length },
  { id: "bmw", label: "BMW", count: GALLERY_PHOTOS.filter(p => p.tags.includes("bmw")).length },
  { id: "mini", label: "MINI", count: GALLERY_PHOTOS.filter(p => p.tags.includes("mini")).length },
];

/* ── FadeIn helper ────────────────────────────────────────────────── */
function FadeIn({ children, className, delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Lightbox ────────────────────────────────────────────────────── */
function Lightbox({
  photos, index, onClose, onPrev, onNext,
}: {
  photos: Photo[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10">
        <X className="h-5 w-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10">
        <ChevronRight className="h-6 w-6" />
      </button>
      <motion.img
        key={photos[index].url}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={photos[index].url}
        alt="Smart Shine Gallery"
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {index + 1} / {photos.length}
      </div>
    </motion.div>
  );
}

/* ── Gallery Grid ────────────────────────────────────────────────── */
function GalleryGrid({ photos, onPhotoClick }: { photos: Photo[]; onPhotoClick: (i: number) => void }) {
  const [loaded, setLoaded] = useState<Set<number>>(new Set());

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Images className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>No photos in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.url}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded.has(i) ? 1 : 0, y: loaded.has(i) ? 0 : 20 }}
          transition={{ duration: 0.4 }}
          className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
          onClick={() => onPhotoClick(i)}
        >
          <img
            src={photo.url}
            alt="Smart Shine Valeting"
            loading="lazy"
            onLoad={() => setLoaded(prev => new Set([...prev, i]))}
            className="w-full h-auto block rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-xl flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden select-none flex items-center">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, #6366f1 0%, transparent 50%)" }} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6">
            <Images className="h-3.5 w-3.5" />
            Our Work Gallery
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            Our Valeting Work
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Real photos from our workshop in Guildford — every car treated with care and precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
            {[
              { n: "271+", l: "Real Photos" },
              { n: "25+", l: "Years Experience" },
              { n: "1000s", l: "Happy Clients" },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-black text-white">{n}</p>
                <p className="text-xs tracking-widest uppercase">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Contact CTA ──────────────────────────────────────────────────── */
function ContactCTA() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}>
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
      <FadeIn className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 mx-auto">
          <Phone className="h-6 w-6 text-blue-300" />
        </div>
        <p className="text-white/70 text-[13px] font-bold tracking-[0.25em] uppercase mb-4">Book Your Valet Today</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Transform Your Car?</h2>
        <p className="text-white/90 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8">
          Call Smart Shine Car Valeting Centre in Guildford
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {[
            { number: "07717 310 046", href: "tel:07717310046" },
            { number: "01483 236 060", href: "tel:01483236060" },
          ].map(({ number, href }, i) => (
            <motion.a
              key={number} href={href}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-4 text-white transition-all hover:bg-white/20 hover:border-blue-400/50"
            >
              <Phone className="h-5 w-5 text-blue-300 flex-shrink-0" />
              <span className="text-[22px] md:text-[26px] font-black tracking-wide">{number}</span>
            </motion.a>
          ))}
        </div>
        <p className="mt-8 text-white/40 text-[13px]">Mon – Sun &nbsp;·&nbsp; 08:00 – 19:00</p>
      </FadeIn>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-gray-900 pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <img src={logoSrc} alt="Smart Shine" className="h-24 mb-4 brightness-0 invert opacity-90" />
            <p className="text-sm text-gray-400 leading-relaxed">Professional car valeting services with over 25 years of experience. Serving Guildford, Godalming, Woking and surrounding areas.</p>
          </div>
          <div>
            <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/private-valeting", label: "Private Vehicle Valeting" },
                { href: "/gallery", label: "Gallery" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-gray-400 hover:text-white transition-colors text-sm">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Contact</h4>
            <div className="space-y-3">
              {[
                { Icon: Phone, text: "07717 310 046" },
                { Icon: Phone, text: "01483 236 060" },
                { Icon: MapPin, text: "Guildford, Surrey" },
                { Icon: Clock, text: "Mon–Sun: 08:00–19:00" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#0a0f2e] border border-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="text-gray-400 text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }) => (
                <a key={href} href={href} className="h-9 w-9 rounded-full bg-[#0a0f2e] border border-blue-900/40 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-600 transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Smart Shine Car Valeting Centre. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Guildford · Godalming · Woking · Surrey</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function Gallery() {
  const [activeTag, setActiveTag] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(60);

  const filteredPhotos = GALLERY_PHOTOS.filter(p => p.tags.includes(activeTag));
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);
  const nextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  }, [lightboxIndex, filteredPhotos.length]);

  useEffect(() => {
    setVisibleCount(60);
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-white font-[Inter]">
      <Navbar />
      <Hero />

      <section id="gallery" className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <FadeIn className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-[#0a0f2e] mb-3">Browse by Brand</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">Filter our work by car make, or view all {GALLERY_PHOTOS.length} photos.</p>
        </FadeIn>

        <FadeIn delay={0.1} className="flex flex-wrap gap-2 justify-center mb-10">
          {TAGS.filter(t => t.count > 0).map(tag => (
            <motion.button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                activeTag === tag.id
                  ? "bg-[#0a0f2e] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag.label}
              <span className={`ml-2 text-xs font-normal ${activeTag === tag.id ? "text-blue-300" : "text-gray-400"}`}>
                {tag.count}
              </span>
            </motion.button>
          ))}
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GalleryGrid photos={visiblePhotos} onPhotoClick={openLightbox} />
          </motion.div>
        </AnimatePresence>

        {visibleCount < filteredPhotos.length && (
          <div className="text-center mt-10">
            <motion.button
              onClick={() => setVisibleCount(c => c + 60)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-[#1a2a6c] px-8 py-3.5 text-sm font-black text-white transition-all shadow-lg"
            >
              Load More Photos ({filteredPhotos.length - visibleCount} remaining)
            </motion.button>
          </div>
        )}
      </section>

      <ContactCTA />
      <Footer />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={filteredPhotos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>

      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  );
}

import 'dotenv/config';
import {seedAssetPath as s} from '@/lib/seed-assets';
import {db} from './index';
import {ensureSeedMemberThumbs, seedMemberPhotos} from './seed-thumbs';
import {teams, members, events} from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  await ensureSeedMemberThumbs();

  // Teams
  const teamData = [
    {id: 't_patron', name: 'Patron', year: 2025},
    {id: 't_mentors_2025', name: 'Mentors', year: 2025},
    {id: 't_exec_2025', name: 'Board of Directors', year: 2025},
    {id: 't_faculty', name: 'Faculty Advisors', year: 2025},
  ];

  for (const team of teamData) {
    await db.insert(teams).values(team).onConflictDoNothing({target: teams.id});
  }
  console.log('✅ Teams seeded');

  // Clear existing members so seed is idempotent
  await db.delete(members);
  console.log('🗑️  Existing members cleared');

  // Members — each has full AVIF + 64px thumb (same as admin upload)
  const memberData = [
    {name: 'Er. Amit Shrivastava', type: 'Patron', title: 'Patron', department: 'HOD, Department of Computer Engineering', email: 'hod.computer@ncit.edu.np', ...seedMemberPhotos('faculty_advisor_amit.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_patron'},
    {name: 'Manash Dev Bhatta', type: 'Executive', email: 'manash.221224@ncit.edu.np', ...seedMemberPhotos('manash_dev_bhatta.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_mentors_2025', collegeYear: 4, socials: {github: 'https://github.com/dsxmanash', instagram: 'https://www.instagram.com/sunfloweraholic01'}},
    {name: 'Niraj Bhusal', type: 'Executive', email: 'niraj.221315@ncit.edu.np', ...seedMemberPhotos('niraj_bhusal.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_mentors_2025', collegeYear: 4, socials: {github: 'https://github.com/niraj5511', linkedin: 'https://www.linkedin.com/in/niraj-bhusal-6262b830a/', instagram: 'https://www.instagram.com/niraj_bhusal551'}},
    {
      name: 'Pratik Mishra', type: 'Mentor', email: 'pratikmis14@gmail.com',
      ...seedMemberPhotos('pratik_mishra.avif'), photoVersion: 0,
      memberYear: 2025, teamId: 't_mentors_2025', collegeYear: 4,
      socials: {
        github: 'https://github.com/Retr0-0',
        facebook: 'https://www.facebook.com/Prats8914',
        linkedin: 'https://www.linkedin.com/in/pratikmis14?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        instagram: 'https://www.instagram.com/frldesigns?igsh=MTVrdDMyZDJhMTBycA==',
      },
    },
    {name: 'Abishek Khadka', type: 'Executive', email: 'abishek.231303@ncit.edu.np', ...seedMemberPhotos('abishek_khadka.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3, socials: {github: 'https://github.com/khadkaabishek', linkedin: 'https://www.linkedin.com/in/abishekkhadkaa/', instagram: 'https://www.instagram.com/awisek.null/', website: 'https://abishek-khadka.com.np/'}},
    {name: 'Anuroop Tater', type: 'Executive', email: 'anuroop.231209@ncit.edu.np', ...seedMemberPhotos('anuroop_tater.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3},
    {name: 'Apil Khadka', type: 'Executive', email: 'apil.231210@ncit.edu.np', ...seedMemberPhotos('apil_khadka.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3, socials: {github: 'https://github.com/Apil-Khadka', linkedin: 'https://www.linkedin.com/in/apil-khadka/', instagram: 'https://www.instagram.com/apil.me/', website: 'https://apilkhadka.com.np/'}},
    {name: 'Arpan Adhikhari', type: 'Executive', email: 'arpan.231309@ncit.edu.np', ...seedMemberPhotos('arpan_adhikari.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3, socials: {github: 'https://github.com/adhikari-arpan', linkedin: 'https://www.linkedin.com/in/adhikari-arpan63/', instagram: 'https://www.instagram.com/adhikari__arpan', website: 'https://arpanadhikari7.com.np/'}},
    {name: 'Niraj Bhatta', type: 'Executive', email: 'niraj.231326@ncit.edu.np', ...seedMemberPhotos('niaj_bhatta.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3, socials: {github: 'https://github.com/Niraj-Bhatta', linkedin: 'www.linkedin.com/in/nirajbhatta559', instagram: 'https://www.instagram.com/niraj_bhatta_4/'}},
    {name: 'Sandesh Khadka', type: 'Executive', email: 'sandesh.231335@ncit.edu.np', ...seedMemberPhotos('sandesh_khadka.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3, socials: {github: 'https://github.com/SandeshKhadka23', linkedin: 'https://www.linkedin.com/in/sandeshkhadka1/', instagram: 'https://www.instagram.com/sandesh.khadka.2/?hl=en'}},
    {name: 'Saru Chauwal', type: 'Executive', email: 'saru.231239@ncit.edu.np', ...seedMemberPhotos('saru_chauwal.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3, socials: {github: 'https://github.com/SaruChauwal', instagram: 'https://www.instagram.com/_saru00/'}},
    {name: 'Shyam Kishor Sah', type: 'Executive', email: 'shyam.231339@ncit.edu.np', ...seedMemberPhotos('shyam_kishor_shah.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3},
    {name: 'Sudip Shrestha', type: 'Executive', email: 'sudip.231244@ncit.edu.np', ...seedMemberPhotos('sudip_shrestha.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 3, socials: {github: 'https://github.com/sudipshrestha-4', instagram: 'https://www.instagram.com/sudip_shrestha4/'}},
    {name: 'Abaneesh Shrestha', type: 'Executive', email: 'abaneesh.241203@ncit.edu.np', ...seedMemberPhotos('abaneesh_shrestha.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 2, socials: {github: 'https://github.com/abaneeshshrestha-glitch', linkedin: 'www.linkedin.com/in/Vanity URL name', instagram: 'https://www.instagram.com/abaneeeeshh/'}},
    {name: 'Biraj Joshi', type: 'Executive', email: 'biraj.241212@ncit.edu.np', ...seedMemberPhotos('biraj_joshi.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 2},
    {name: 'Iksha Gurung', type: 'Executive', email: 'iksha.241312@ncit.edu.np', ...seedMemberPhotos('iksha_gurung.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 2, socials: {github: 'iksha241312-debug'}},
    {name: 'Pranish Manandhar', type: 'Executive', email: 'pranish.241324@ncit.edu.np', ...seedMemberPhotos('pranish_manandhar.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 2, socials: {github: 'https://github.com/PranishManandhar', linkedin: 'https://www.linkedin.com/in/pranish-manandhar-54452b245/', instagram: 'https://www.instagram.com/_pranish.manandhar/'}},
    {name: 'Anamol Rijal', type: 'Executive', email: 'anamol@ncit.edu.np', ...seedMemberPhotos('anmol.avif'), photoVersion: 0, memberYear: 2025, teamId: 't_exec_2025', collegeYear: 1, socials: {github: 'https://github.com/', linkedin: 'https://www.linkedin.com/', instagram: 'https://www.instagram.com/'}},
  ];

  for (const member of memberData) {
    await db.insert(members).values(member);
  }
  console.log('✅ Members seeded');

  // Events
  const eventData = [
    {
      id: '001',
      title: 'Kickstart Your Tech Journey: Explore • Learn • Build',
      date: '2025-12-08',
      time: '11:00 AM - 1:00 PM',
      location: 'NCIT Hall',
      description: '**Theme:** "Explore • Learn • Build — Your Journey as a Computer Engineer"\n\n## EVENT OBJECTIVES\n\n- Introduce CITC — purpose, vision, activities\n- Familiarize students with major domains of Computer Engineering\n- Give short & practical roadmaps for each domain\n- Introduce essential tools, software, and platforms useful for daily CE life\n- Show benefits & opportunities — GitHub Student Pack, learning platforms, hackathons\n- Build excitement, confidence, and curiosity among participants\n- Recruit engaged members for future events',
      image: s('event/001/WhatsApp Image 2025-12-08 at 19.28.39.jpeg'),
      status: 'past' as const,
      academicYear: 2025,
      tags: ['Orientation', 'Tech Journey', 'Introductory'],
      gallery: [
        s('event/001/WhatsApp Image 2025-12-08 at 19.28.39.jpeg'),
        s('event/001/WhatsApp Image 2025-12-08 at 19.28.41 (1).jpeg'),
        s('event/001/WhatsApp Image 2025-12-08 at 19.28.41.jpeg'),
      ],
    },
    {
      id: '002',
      title: 'Prompt to Image – AI Creativity Competition',
      date: '2026-07-21',
      time: '1 Week (Online) + Physical battle',
      location: 'Online',
      description: '## Introduction\n\nArtificial Intelligence is reshaping creative expression, with **prompt engineering** emerging as a crucial skill that connects human intent with AI-generated outcomes.',
      image: s('event/002/top_image.jpg'),
      status: 'past' as const,
      academicYear: 2026,
      registrationLink: 'https://citc.ncit.edu.np/register/ai',
      tags: ['AI', 'Competition', 'Prompt Engineering', 'Creativity'],
      gallery: [
        s('event/002/top_image.jpg'),
        s('event/002/1c135d51-1936-4f56-9630-9ff17e23b0b4.jpg'),
        s('event/002/6da29576-c123-446c-b096-82d613ffa521.jpg'),
      ],
    },
    {
      id: '003',
      title: 'IoT Workshop',
      date: '2026-02-02',
      time: '6 Days (2 Hours Daily)',
      location: 'NCIT Room:125',
      description: '## Introduction\n\nThe **Computer Engineering Innovation and Tech Club (CITC)**, in collaboration with the Department of Computer Engineering, NCIT, presents **"IoT Hardware Workshop"**, an intensive 6-day workshop designed to bridge the gap between theoretical knowledge and practical hardware implementation.',
      image: s('event/003/IoTExpo2082.png'),
      status: 'past' as const,
      academicYear: 2026,
      tags: ['IoT', 'Embedded Systems', 'Hardware', 'Workshop'],
    },
  ];

  for (const event of eventData) {
    await db
        .insert(events)
        .values(event)
        .onConflictDoUpdate({
          target: events.id,
          set: {
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            description: event.description,
            image: event.image,
            status: event.status,
            registrationLink: event.registrationLink,
            tags: event.tags,
            gallery: event.gallery,
            academicYear: event.academicYear,
            updatedAt: new Date(),
          },
        });
  }
  console.log('✅ Events seeded');
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

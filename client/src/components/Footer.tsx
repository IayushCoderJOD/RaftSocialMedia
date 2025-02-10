import { faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GITHUB_REPOSITORY } from '../lib/constants';

const Footer = () => {
  return (
    <div className="ui vertical footer segment">
      <div className="ui center aligned container horizontal small divided link list">
        <div className="">
          &copy; 2025 Ayush Tyagi{' '}
          <a
            href="https://twitter.com/AyushTy4089956"
            rel="noopener noreferrer"
            target="_blank"
          >

            <FontAwesomeIcon
              size="1x"
              className="text-gray-200"
              icon={faTwitterSquare}
            />

            <i className="fab fa-twitter-square"></i>
          </a>{' '}
          <a
            href="https://www.linkedin.com/in/ayush-tyagi-011a731b5/"
            rel="noopener noreferrer"
            target="_blank"
          >

            <FontAwesomeIcon
              size="1x"
              className="text-gray-200"
              icon={faLinkedin}
            />
          </a>
        </div>
        <a
          href={`${GITHUB_REPOSITORY}`}
          className="font-medium hover:underline"
        >
          View code on GitHub
        </a>
      </div>
    </div>
  );
};

export default Footer;

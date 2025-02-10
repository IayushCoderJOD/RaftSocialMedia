import { useContext } from 'react';
import Typewriter from 'typewriter-effect';
import { ThemeContext } from '../context/theme';

const Intro = () => {
    const { isDarkTheme } = useContext(ThemeContext);


    return (
        <>
            <div className="jumbotron m-3 mt-5">

                <h1 className={isDarkTheme ? "display-4 text-4xl text-white  font-bold pb-5 " : "display-4 text-4xl  font-bold pb-5 "}>
                    {<Typewriter
                        options={{
                            autoStart: true,
                            loop: true,
                        }}
                        onInit={(typewriter) => {
                            typewriter.typeString('Hello, this is RaftLabs meets!!')
                                .callFunction(() => {
                                })
                                .pauseFor(1000)

                                .start()
                                .deleteAll()
                        }
                        }
                    />}
                </h1>
                <p className={isDarkTheme ? "text-white" : ""}>
                    This app is meant to make the employees closer😅  <br />
                    <a target='_blank' href="https://github.com/IayushCoderJOD/RaftSocialMedia/blob/main/README.md">
                        <b className='text-purple-800 text-lg font-semibold'>Readme file <span className='text-red-400 font-bold' >Link</span> to know the site's flow</b>
                    </a>
                </p>
            </div>
        </>

    )
}

export default Intro;